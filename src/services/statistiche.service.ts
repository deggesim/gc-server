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
    return this.andamentoRepository.statistics(1, interval);
  }

  public async carburante(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.statistics(2, interval);
  }

  public async bolletta(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.statistics(3, interval);
  }

  public async casa(interval: Interval): Promise<IStatistica> {
    return this.andamentoRepository.statistics(7, interval);
  }
}
