import { Inject, Singleton } from "typescript-ioc";
import Utente from "../models/utente";
import UtenteRepository from "../repositories/utente.repository";

@Singleton
export default class UtenteService {

  constructor(
    @Inject private utenteRepository: UtenteRepository,
  ) { }

  public async login(utente: Utente): Promise<Utente> {
    return this.utenteRepository.login(utente);
  }

  public async logout(utente: Utente, token: string): Promise<Utente> {
    return this.utenteRepository.logout(utente, token);
  }

  public async logoutAll(utente: Utente): Promise<Utente> {
    return this.utenteRepository.logoutAll(utente);
  }

  public async me($id: number, token: string): Promise<Utente> {
    return this.utenteRepository.me($id, token);
  }

  public async update(utente: Utente): Promise<Utente> {
    return this.utenteRepository.update(utente);
  }

  public async delete($id: number) {
    return this.utenteRepository.delete($id);
  }


}
