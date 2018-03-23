import { IRouterContext } from 'koa-router';
import { Inject } from 'typescript-ioc';

import StatisticheController from '../controllers/StatisticheController';
import Route from '../models/Route';
import IRoutes from './IRoutes';

export default class AndamentoRoutes extends IRoutes {

    constructor(
        @Inject private statisticheController: StatisticheController
    ) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute("/statistiche/spese-frequenti/:interval", "get", (ctx: IRouterContext) => this.statisticheController.speseFrequenti(ctx)),
            Route.newRoute("/statistiche/spesa/:interval", "get", (ctx: IRouterContext) => this.statisticheController.spesa(ctx)),
            Route.newRoute("/statistiche/carburante/:interval", "get", (ctx: IRouterContext) => this.statisticheController.carburante(ctx)),
            Route.newRoute("/statistiche/bolletta/:interval", "get", (ctx: IRouterContext) => this.statisticheController.bolletta(ctx)),
        ];
    }
}
