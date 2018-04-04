import { Inject, Singleton } from 'typescript-ioc';

import BadRequestEntity from '../exceptions/bad-request-entity.error';
import EntityNotFoundError from '../exceptions/entity-not-found.error';
import Andamento from '../models/andamento';
import AndamentoRepository from '../repositories/andamento.repository';

@Singleton
export default class AndamentoService {

  constructor(
    @Inject private andamentoRepository: AndamentoRepository
  ) { }

  public async findById(id: number): Promise<Andamento> {
    return this.andamentoRepository.findAndamentoById(id);
  }

  public async findAll(): Promise<Andamento[]> {
    return this.andamentoRepository.getAllAndamentos();
  }

  public async update(andamento: Andamento): Promise<Andamento> {
    try {
      await this.andamentoRepository.findAndamentoById(andamento.$id);
      return this.andamentoRepository.saveAndamento(andamento);
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new BadRequestEntity("The given andamento does not exist yet.");
      }
      throw e;
    }
  }

  public async save(andamento: Andamento): Promise<Andamento> {
    return this.andamentoRepository.saveAndamento(andamento);
  }

  public async delete(andamentoId: number): Promise<void> {
    return this.andamentoRepository.deleteAndamento(andamentoId);
  }
}
