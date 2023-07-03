import { PostgresDataSource } from "../data-source";
import Andamento from "../models/andamento";
import TipoSpesa from "../models/tipo-spesa";
import Token from "../models/token";
import Utente from "../models/utente";

export default abstract class Repository {
  protected getTipoSpesaRepository() {
    return PostgresDataSource.manager.getRepository(TipoSpesa);
  }

  protected getAndamentoRepository() {
    return PostgresDataSource.manager.getRepository(Andamento);
  }

  protected getUtenteRepository() {
    return PostgresDataSource.manager.getRepository(Utente);
  }

  protected getTokenRepository() {
    return PostgresDataSource.manager.getRepository(Token);
  }
}
