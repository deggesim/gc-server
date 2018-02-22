import { getEntityManager } from 'typeorm';

import Andamento from '../models/Andamento';
import TipoSpesa from '../models/TipoSpesa';

export default abstract class IRepository {

    protected getTipoSpesaRepository() {
        return getEntityManager().getRepository(TipoSpesa);
    }

    protected getAndamentoRepository() {
        return getEntityManager().getRepository(Andamento);
    }

}
