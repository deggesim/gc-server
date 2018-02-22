import { IRouterContext } from 'koa-router';
import { Inject } from 'typescript-ioc';

import AndamentoController from '../controllers/AndamentoController';
import Route from '../models/Route';
import IRoutes from './IRoutes';

export default class AndamentoRoutes extends IRoutes {

    constructor(
        @Inject private andamentoController: AndamentoController
    ) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute("/andamento", "get", (ctx: IRouterContext) => this.andamentoController.getAllAndamentos(ctx)),
            Route.newRoute("/andamento/:id", "get", (ctx: IRouterContext) => this.andamentoController.findAndamentoById(ctx)),
            Route.newRoute("/andamento", "post", (ctx: IRouterContext) => this.andamentoController.saveAndamento(ctx)),
            Route.newRoute("/andamento/:id", "put", (ctx: IRouterContext) => this.andamentoController.updateAndamento(ctx)),
            Route.newRoute("/andamento/:id", "delete", (ctx: IRouterContext) => this.andamentoController.deleteAndamento(ctx)),
        ];
    }
}
