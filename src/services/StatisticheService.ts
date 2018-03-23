import { Inject, Singleton } from 'typescript-ioc';

import { Statistica } from '../models/statistica';
import AndamentoRepository from '../repositories/AndamentoRepository';
import { Interval } from '../models/interval';

@Singleton
export default class StatisticheService {

    constructor(
        @Inject private andamentoRepository: AndamentoRepository
    ) { }

    public async speseFrequenti(interval: Interval): Promise<Statistica> {
        return this.andamentoRepository.speseFrequenti(interval);
    }

    public async spesa(interval: Interval): Promise<Statistica> {
        return this.andamentoRepository.spesa(interval);
    }

    public async carburante(interval: Interval): Promise<Statistica> {
        return this.andamentoRepository.carburante(interval);
    }

    public async bolletta(interval: Interval): Promise<Statistica> {
        return this.andamentoRepository.bolletta(interval);
    }
}
