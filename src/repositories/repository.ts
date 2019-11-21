import { getManager } from 'typeorm';
import Andamento from '../models/andamento';
import TipoSpesa from '../models/tipo-spesa';
import Token from '../models/token';
import Utente from '../models/utente';

export default abstract class Repository {

  protected getTipoSpesaRepository() {
    return getManager().getRepository(TipoSpesa);
  }

  protected getAndamentoRepository() {
    return getManager().getRepository(Andamento);
  }

  protected getUtenteRepository() {
    return getManager().getRepository(Utente);
  }

  protected getTokenRepository() {
    return getManager().getRepository(Token);
  }

}
