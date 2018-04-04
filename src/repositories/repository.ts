import { getManager } from 'typeorm';

import Andamento from '../models/andamento';
import TipoSpesa from '../models/tipo-spesa';

export default abstract class Repository {

  protected getTipoSpesaRepository() {
    return getManager().getRepository(TipoSpesa);
  }

  protected getAndamentoRepository() {
    return getManager().getRepository(Andamento);
  }

}
