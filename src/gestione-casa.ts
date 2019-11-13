import * as Koa from "koa";
import * as bodyParser from "koa-bodyparser";
import * as logger from "koa-logger";
import * as Router from "koa-router";
import * as PostgressConnectionStringParser from "pg-connection-string";
import { createConnection } from "typeorm";
import { Inject } from "typescript-ioc";
import Andamento from "./models/andamento";
import TipoSpesa from "./models/tipo-spesa";
import Token from "./models/token";
import Utente from "./models/utente";
import AndamentoRoutes from "./routes/andamento.routes";
import StatisticheRoutes from "./routes/statistiche.routes";
import TipoSpesaRoutes from "./routes/tipo-spesa.routes";

export default class GestioneCasa {

  constructor(
    @Inject private andamentoRoutes: AndamentoRoutes,
    @Inject private tipoSpesaRoutes: TipoSpesaRoutes,
    @Inject private statisticheRoutes: StatisticheRoutes,
  ) { }

  private async createApp() {
    const connectionOptions = PostgressConnectionStringParser.parse(process.env.DATABASE_URL as string);

    await createConnection({
      type: "postgres",
      host: connectionOptions.host as string,
      port: connectionOptions.port as unknown as number || 5432,
      username: connectionOptions.user as string,
      password: connectionOptions.password as string,
      database: connectionOptions.database as string,
      schema: "gc",
      entities: [
        Andamento, TipoSpesa, Utente, Token,
      ],
      logging: true,
    });

    const app: Koa = new Koa();
    const freeRouter: Router = new Router();
    const router: Router = new Router();

    const cors = require("@koa/cors");
    app.use(cors());

    this.andamentoRoutes.register(freeRouter, router);
    this.tipoSpesaRoutes.register(freeRouter, router);
    this.statisticheRoutes.register(freeRouter, router);

    app.use(logger());
    app.use(bodyParser());
    app.use(freeRouter.routes());
    app.use(freeRouter.allowedMethods());

    // Middleware below this line is only reached if JWT token is valid
    const jwt = require("koa-jwt");
    app.use(jwt({ secret: process.env.PUBLIC_KEY }));
    app.use(router.routes());
    app.use(router.allowedMethods());

    return Promise.resolve(app);
  }

  public async start() {
    const app = await this.createApp();
    console.log("Started listening on port 5000...");
    const server = app.listen(process.env.PORT || 5000);
    return Promise.resolve(server);
  }

}
