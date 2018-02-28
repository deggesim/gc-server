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
}
