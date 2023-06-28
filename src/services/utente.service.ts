import { Inject, Singleton } from "typescript-ioc";
import Utente from "../models/utente";
import UtenteRepository from "../repositories/utente.repository";

@Singleton
export default class UtenteService {
  constructor(@Inject private utenteRepository: UtenteRepository) {}

  public async create(
    utente: Utente
  ): Promise<{ utente: Utente; token: string }> {
    return this.utenteRepository.create(utente);
  }

  public async login(
    utente: Utente
  ): Promise<{ utente: Utente; token: string }> {
    return this.utenteRepository.login(utente);
  }

  public async logout(utente: Utente, token: string): Promise<Utente> {
    return this.utenteRepository.logout(utente, token);
  }

  public async logoutAll(utente: Utente): Promise<Utente> {
    return this.utenteRepository.logoutAll(utente);
  }

  public async update(utente: Utente): Promise<Utente> {
    return this.utenteRepository.update(utente);
  }

  public async delete(id: number) {
    return this.utenteRepository.delete(id);
  }

  public async find(id: number): Promise<Utente> {
    return this.utenteRepository.find(id);
  }
}
