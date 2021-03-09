import * as bcrypt from 'bcryptjs';
import * as jsonwebtoken from 'jsonwebtoken';
import { FindOneOptions } from 'typeorm';
import { Singleton } from 'typescript-ioc';
import BadRequestEntity from '../exceptions/bad-request-entity.error';
import EntityNotFoundError from '../exceptions/entity-not-found.error';
import Token from '../models/token';
import Utente from '../models/utente';
import IRepository from './repository';

@Singleton
export default class UtenteRepository extends IRepository {

  public async create(utenteInput: Utente): Promise<{ utente: Utente, token: string }> {
    utenteInput.password = await bcrypt.hash(utenteInput.password, 8);
    const utente: Utente | undefined = await this.getUtenteRepository().save(utenteInput);

    if (!utente) {
      throw new EntityNotFoundError();
    }

    return await this.generateAuthToken(utente);
  }

  public async login(utenteInput: Utente): Promise<{ utente: Utente, token: string }> {
    const utente: Utente | undefined = await this.getUtenteRepository().findOne({ email: utenteInput.email });

    if (!utente) {
      throw new EntityNotFoundError('Email o password errate');
    }

    const isMatch = await bcrypt.compare(utenteInput.password, utente.password);
    if (!isMatch) {
      throw new BadRequestEntity('Email o password errate');
    }

    return await this.generateAuthToken(utente);
  }

  public async logout(utente: Utente, userToken: string): Promise<Utente> {
    const tokenToDelete = utente.tokens.find((token: Token) => token.token === userToken);
    if (!tokenToDelete) {
      throw new EntityNotFoundError();
    }
    await this.getTokenRepository().delete(tokenToDelete.id);
    utente.tokens = utente.tokens.filter((token: Token) => token.token !== userToken);
    return utente;
  }

  public async logoutAll(utente: Utente): Promise<Utente> {
    await this.getTokenRepository().delete({ utente });
    utente.tokens = [];
    return utente;
  }

  public async update(utente: Utente): Promise<Utente> {
    if (this.isPasswordModified(utente)) {
      utente.password = await bcrypt.hash(utente.password, 8);
    }
    return await this.getUtenteRepository().save(utente);
  }

  public async delete(id: number): Promise<Utente> {
    const utente = await this.getUtenteRepository().findOne({ id });
    if (!utente) {
      throw new EntityNotFoundError();
    }

    await this.getTokenRepository().delete({ utente });
    await this.getUtenteRepository().delete({ id });
    return utente;
  }

  public async find(id: number): Promise<Utente> {
    const result = await this.getUtenteRepository().findOne({ id });
    if (!result) {
      throw new EntityNotFoundError();
    }
    return result;
  }

  private async generateAuthToken(utente: Utente) {
    const token = jsonwebtoken.sign({ id: utente.id.toString() }, String(process.env.PUBLIC_KEY), {
      expiresIn: '14d',
    });
    if (utente.tokens) {
      utente.tokens.push(Token.newToken({ token }));
    } else {
      utente.tokens = [Token.newToken({ token })];
    }
    utente = await this.getUtenteRepository().save(utente);
    return { utente, token };
  }

  private isPasswordModified(utente: Utente): boolean {
    return 'password' in utente;
  }

}
