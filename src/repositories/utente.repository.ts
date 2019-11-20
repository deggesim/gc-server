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
    const utente: Utente | undefined = await this.getUtenteRepository().save(utenteInput);

    if (!utente) {
      throw new EntityNotFoundError();
    }

    return await this.generateAuthToken(utente);
  }

  public async login(utenteInput: Utente): Promise<{ utente: Utente, token: string }> {
    const findOptions: FindOneOptions<Utente> = {
      where: {
        $email: utenteInput.email,
      },
    };
    const utente: Utente | undefined = await this.getUtenteRepository().findOne(findOptions);

    if (!utente) {
      throw new EntityNotFoundError();
    }

    const isMatch = await bcrypt.compare(utenteInput.password, utente.password);
    if (!isMatch) {
      throw new BadRequestEntity('Unable to login');
    }

    return await this.generateAuthToken(utente);
  }

  private async generateAuthToken(utente: Utente) {
    const token = jsonwebtoken.sign({ id: utente.id.toString() }, String(process.env.PUBLIC_KEY), {
      expiresIn: '2 weeks',
    });
    if (utente.tokens) {
      utente.tokens.push(Token.newToken({ token }));
    } else {
      utente.tokens = [Token.newToken({ token })];
    }
    utente = await this.update(utente);
    return { utente, token };
  }

  public async logout(utente: Utente, userToken: string): Promise<Utente> {
    utente.tokens = utente.tokens.filter((token: Token) => token.token !== userToken);
    return await this.getUtenteRepository().save(utente);
  }

  public async logoutAll(utente: Utente): Promise<Utente> {
    utente.tokens = [];
    return await this.getUtenteRepository().save(utente);
  }

  public async update(utente: Utente): Promise<Utente> {
    return await this.getUtenteRepository().save(utente);
  }

  public async delete(id: number) {
    await this.getUtenteRepository().delete({ id });
  }

  public async find(id: number): Promise<Utente> {
    const result = await this.getUtenteRepository().findOne({ id });
    if (!result) {
      throw new EntityNotFoundError();
    }
    return result;
  }

}
