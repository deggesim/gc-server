import { Singleton } from 'typescript-ioc';

import EntityNotFoundError from '../exceptions/EntityNotFoundError';
import TipoSpesa from '../models/TipoSpesa';
import IRepository from '../repositories/IRepository';

@Singleton
export default class TipoSpesaRepository extends IRepository {

    public async getAllTipoSpesas(): Promise<TipoSpesa[]> {
        return this.getTipoSpesaRepository().find();
    }

    public async findTipoSpesaById(id: number): Promise<TipoSpesa> {
        const result = await this.getTipoSpesaRepository().findOneById(id);
        if (!result) {
            throw new EntityNotFoundError("No tipoSpesa was found for ID: " + id);
        }
        return result;
    }
}
