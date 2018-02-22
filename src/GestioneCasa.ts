import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as logger from "koa-logger";
import * as Router from "koa-router";

import { createConnection } from "typeorm";
import { Inject } from "typescript-ioc";

import TipoSpesa from "./models/TipoSpesa";
import Andamento from "./models/Andamento";
import Route from "./models/Route";
import TipoSpesaRoutes from "./routes/TipoSpesaRoutes";
import AndamentoRoutes from "./routes/AndamentoRoutes";

export default class GestioneCasa {

    constructor(
        @Inject private andamentoRoutes: AndamentoRoutes,
        @Inject private tipoSpesaRoutes: TipoSpesaRoutes) { }

    private async createApp() {
        await createConnection({
            name: "default",
            driver: {
                type: "mysql",
                host: "localhost",
                port: 3306,
                username: "root",
                password: "sabina",
                database: "gc",
            },
            entities: [
                Andamento, TipoSpesa,
            ],
        });

        const app: Koa = new Koa();
        const router: Router = new Router();

        this.andamentoRoutes.register(router);
        this.tipoSpesaRoutes.register(router);

        app.use(logger());
        app.use(bodyParser());
        app.use(router.routes());
        app.use(router.allowedMethods());

        return Promise.resolve(app);
    }

    public async start() {
        const app = await this.createApp();
        console.log("Started listening on port 3000...");
        const server = app.listen(3000);
        return Promise.resolve(server);
    }

}
