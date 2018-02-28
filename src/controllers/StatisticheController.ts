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

    public async spesaMensile(ctx: IRouterContext) {
        ctx.body = await this.statisticheService.spesaMensile();
    }
}
