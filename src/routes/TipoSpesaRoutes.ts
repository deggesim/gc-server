import { IRouterContext } from 'koa-router';
import { Inject } from 'typescript-ioc';

import TipoSpesaController from '../controllers/TipoSpesaController';
import Route from '../models/Route';
import IRoutes from './IRoutes';

export default class TipoSpesaRoutes extends IRoutes {

    constructor(@Inject private directorController: TipoSpesaController) {
        super();
    }

    protected getRoutes(): Route[] {
        return [
            Route.newRoute("/tipo-spesa", "get", (ctx: IRouterContext) => this.directorController.getAllTipoSpesas(ctx)),
            Route.newRoute("/tipo-spesa/:id", "get", (ctx: IRouterContext) => this.directorController.findTipoSpesaById(ctx)),
            // Route.newRoute("/tipo-spesa/", "post", (ctx: IRouterContext) => this.directorController.saveTipoSpesa(ctx)),
            // Route.newRoute("/tipo-spesa/:id", "put", (ctx: IRouterContext) => this.directorController.saveTipoSpesa(ctx)),
            // Route.newRoute("/tipo-spesa/:id", "delete", (ctx: IRouterContext) => this.directorController.deleteTipoSpesa(ctx)),
        ];
    }

}