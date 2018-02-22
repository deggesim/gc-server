import { Singleton } from 'typescript-ioc';

import EntityNotFoundError from '../exceptions/EntityNotFoundError';
import TipoSpesa from '../models/TipoSpesa';
import IRepository from '../repositories/IRepository';

@Singleton
export default class TipoSpesaRepository extends IRepository {

    constructor(
        // @Inject private andamentoRepository: AndamentoRepository
    ) {
        super();
    }

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

    // public async saveTipoSpesa(director: TipoSpesa): Promise<TipoSpesa> {
    //     return this.getTipoSpesaRepository().persist(director);
    // }

    // public async deleteTipoSpesaWithId(id: number) {
    //     await this.andamentoRepository.deleteAndamentosFromTipoSpesa(id);
    //     await this.getTipoSpesaRepository()
    //         .createQueryBuilder("tipoSpesa")
    //         .delete()
    //         .where("tipoSpesa.id = :id", { id })
    //         .execute();
    //     return Promise.resolve();
    // }
}
