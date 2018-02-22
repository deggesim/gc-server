import { Inject, Singleton } from 'typescript-ioc';

import TipoSpesa from '../models/TipoSpesa';
import TipoSpesaRepository from '../repositories/TipoSpesaRepository';

@Singleton
export default class TipoSpesaService {

    constructor(
        @Inject private tipoSpesaRepository: TipoSpesaRepository
    ) { }

    public async findById(id: number): Promise<TipoSpesa> {
        return this.tipoSpesaRepository.findTipoSpesaById(id);
    }

    public async findAll(): Promise<TipoSpesa[]> {
        return this.tipoSpesaRepository.getAllTipoSpesas();
    }

    // public async save(director: TipoSpesa): Promise<TipoSpesa> {
    //     return this.tipoSpesaRepository.saveTipoSpesa(director);
    // }

    // public async update(director: TipoSpesa) {
    //     try {
    //         await this.tipoSpesaRepository.findTipoSpesaById(director.$id);
    //         return this.tipoSpesaRepository.saveTipoSpesa(director);
    //     } catch (e) {
    //         if (e instanceof EntityNotFoundError) {
    //             throw new BadRequestEntity("The given tipoSpesa does not exist yet.");
    //         }
    //     }
    // }

    // public async delete(directorId: number) {
    //     return this.tipoSpesaRepository.deleteTipoSpesaWithId(directorId);
    // }
}
