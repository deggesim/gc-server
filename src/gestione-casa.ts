import 'reflect-metadata';

import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as logger from 'koa-logger';
import * as Router from 'koa-router';
import * as PostgressConnectionStringParser from 'pg-connection-string';
import { createConnection } from 'typeorm';
import { Inject } from 'typescript-ioc';

import Andamento from './models/andamento';
import TipoSpesa from './models/tipo-spesa';
import AndamentoRoutes from './routes/andamento.routes';
import StatisticheRoutes from './routes/statistiche.routes';
import TipoSpesaRoutes from './routes/tipo-spesa.routes';

export default class GestioneCasa {

  constructor(
    @Inject private andamentoRoutes: AndamentoRoutes,
    @Inject private tipoSpesaRoutes: TipoSpesaRoutes,
    @Inject private statisticheRoutes: StatisticheRoutes
  ) { }

  private async createApp() {
    const env = process.env;
    const connectionOptions = PostgressConnectionStringParser.parse(<string>process.env.DATABASE_URL);

    await createConnection({
      type: "postgres",
      host: <string>connectionOptions.host,
      port: <number>connectionOptions.port || 5432,
      username: <string>connectionOptions.user,
      password: <string>connectionOptions.password,
      database: <string>connectionOptions.database,
      schema: "gc",
      entities: [
        Andamento, TipoSpesa,
      ],
      logging: true
    });

    const app: Koa = new Koa();
    const router: Router = new Router();

    const cors = require('@koa/cors');
    app.use(cors());

    this.andamentoRoutes.register(router);
    this.tipoSpesaRoutes.register(router);
    this.statisticheRoutes.register(router);

    app.use(logger());
    app.use(bodyParser());
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
