import { Singleton } from "typescript-ioc";
import EntityNotFoundError from "../exceptions/entity-not-found.error";
import Utente from "../models/utente";
import IRepository from "./repository";

@Singleton
export default class UtenteRepository extends IRepository {

  public async login(utente: Utente): Promise<Utente> {
    const result = await this.getUtenteRepository().findOne({ $email: utente.$email, $password: utente.$password });
    if (!result) {
      throw new EntityNotFoundError();
    }
    return result;
  }

  public async logout(utente: Utente, userToken: string): Promise<Utente> {
    utente.$tokens = utente.$tokens.filter((token: string) => token !== userToken);
    return await this.getUtenteRepository().save(utente);
  }

  public async logoutAll(utente: Utente): Promise<Utente> {
    utente.$tokens = [];
    return await this.getUtenteRepository().save(utente);
  }

  public async me($id: number, userToken: string): Promise<Utente> {
    const result = await this.getUtenteRepository().findOne({ $id });
    if (!result) {
      throw new EntityNotFoundError();
    }
    if (result.$tokens.find((token: string) => token === userToken)) {
      return result;
    } else {
      throw new EntityNotFoundError();
    }
  }

  public async update(utente: Utente): Promise<Utente> {
    return await this.getUtenteRepository().save(utente);
  }

  public async delete($id: number) {
    await this.getUtenteRepository().delete({ $id });
  }

}
