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
            Route.newRoute("/statistiche/spesa-mensile/", "get", (ctx: IRouterContext) => this.statisticheController.spesaMensile(ctx)),
            Route.newRoute("/statistiche/carburante-mensile/", "get", (ctx: IRouterContext) => this.statisticheController.carburanteMensile(ctx)),
            Route.newRoute("/statistiche/bolletta-mensile/", "get", (ctx: IRouterContext) => this.statisticheController.bollettaMensile(ctx)),
        ];
    }
}
