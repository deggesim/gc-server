import { IRouterContext } from 'koa-router';
import { Inject } from 'typescript-ioc';
import UtenteController from '../controllers/utente.controller';
import Route from '../models/route';
import IRoutes from './routes';

export default class UtenteRoutes extends IRoutes {

  constructor(
    @Inject private utenteController: UtenteController,
  ) {
    super();
  }

  protected getRoutes(): Route[] {
    return [
      Route.newRoute('/utente/login', 'post', (ctx: IRouterContext) => this.utenteController.login(ctx)),
      Route.newRoute('/utente/logout', 'post', (ctx: IRouterContext) => this.utenteController.logout(ctx)),
      Route.newRoute('/utente/logout-all', 'post', (ctx: IRouterContext) => this.utenteController.logoutAll(ctx)),
      Route.newRoute('/utente/me', 'get', (ctx: IRouterContext) => this.utenteController.me(ctx)),
      Route.newRoute('/utente/me', 'patch', (ctx: IRouterContext) => this.utenteController.update(ctx)),
      Route.newRoute('/utente/delete', 'delete', (ctx: IRouterContext) => this.utenteController.delete(ctx)),
    ];
  }
}
