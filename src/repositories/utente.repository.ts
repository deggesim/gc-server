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

  public async login(utente: Utente): Promise<Utente> {
    const findOptions: FindOneOptions<Utente> = {
      where: {
        $email: utente.email,
      },
    };
    let utenteDb: Utente | undefined = await this.getUtenteRepository().findOne(findOptions);

    if (!utenteDb) {
      throw new EntityNotFoundError();
    }

    const isMatch = await bcrypt.compare(utente.password, utenteDb.password);
    if (!isMatch) {
      throw new BadRequestEntity('Unable to login');
    }

    const token = jsonwebtoken.sign({ id: utenteDb.id.toString() }, String(process.env.PUBLIC_KEY));
    console.log(token);

    utenteDb.tokens.push(Token.newToken({ token }));
    utenteDb = await this.update(utenteDb);

    return utenteDb;
  }

  public async logout(utente: Utente, userToken: string): Promise<Utente> {
    utente.tokens = utente.tokens.filter((token: Token) => token.token !== userToken);
    return await this.getUtenteRepository().save(utente);
  }

  public async logoutAll(utente: Utente): Promise<Utente> {
    utente.tokens = [];
    return await this.getUtenteRepository().save(utente);
  }

  public async me(id: number, userToken: string): Promise<Utente> {
    const result = await this.getUtenteRepository().findOne({ id });
    if (!result) {
      throw new EntityNotFoundError();
    }
    if (result.tokens.find((token: Token) => token.token === userToken)) {
      return result;
    } else {
      throw new EntityNotFoundError();
    }
  }

  public async update(utente: Utente): Promise<Utente> {
    return await this.getUtenteRepository().save(utente);
  }

  public async delete(id: number) {
    await this.getUtenteRepository().delete({ id });
  }

}
