import { Inject, Singleton } from "typescript-ioc";
import { Interval } from "../models/interval";
import { IStatistica } from "../models/statistica";
import AndamentoRepository from "../repositories/andamento.repository";

@Singleton
export default class StatisticheService {
  constructor(@Inject private andamentoRepository: AndamentoRepository) {}

  public async speseFrequenti(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.speseFrequenti(interval);
  }

  public async spesa(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.statistics(interval, 1);
  }

  public async carburante(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.statistics(interval, 2);
  }

  public async bolletta(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.statistics(interval, 3);
  }

  public async casa(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.statistics(interval, 7);
  }

  public async tutto(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.statistics(interval);
  }
}
