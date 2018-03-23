import { IRouterContext } from 'koa-router';
import { Inject, Singleton } from 'typescript-ioc';

import StatisticheService from '../services/StatisticheService';

@Singleton
export default class StatisticheController {

    constructor(
        @Inject private statisticheService: StatisticheService
    ) { }

    public async speseFrequenti(ctx: IRouterContext) {
        ctx.body = await this.statisticheService.speseFrequenti(ctx.params.interval);
    }

    public async spesa(ctx: IRouterContext) {
        ctx.body = await this.statisticheService.spesa(ctx.params.interval);
    }

    public async carburante(ctx: IRouterContext) {
        ctx.body = await this.statisticheService.carburante(ctx.params.interval);
    }

    public async bolletta(ctx: IRouterContext) {
        ctx.body = await this.statisticheService.bolletta(ctx.params.interval);
    }
}
