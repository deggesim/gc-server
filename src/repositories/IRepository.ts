import { getManager } from 'typeorm';

import Andamento from '../models/Andamento';
import TipoSpesa from '../models/TipoSpesa';

export default abstract class IRepository {

    protected getTipoSpesaRepository() {
        return getManager().getRepository(TipoSpesa);
    }

    protected getAndamentoRepository() {
        return getManager().getRepository(Andamento);
    }

}
