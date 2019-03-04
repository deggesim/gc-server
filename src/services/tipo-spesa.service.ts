import { Inject, Singleton } from "typescript-ioc";
import TipoSpesa from "../models/tipo-spesa";
import TipoSpesaRepository from "../repositories/tipo-spesa.repository";

@Singleton
export default class TipoSpesaService {

  constructor(
    @Inject private tipoSpesaRepository: TipoSpesaRepository,
  ) { }

  public async findById(id: number): Promise<TipoSpesa> {
    return this.tipoSpesaRepository.findTipoSpesaById(id);
  }

  public async findAll(): Promise<TipoSpesa[]> {
    return this.tipoSpesaRepository.getAllTipoSpesas();
  }
}
