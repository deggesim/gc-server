import { IRouterContext } from 'koa-router';
import { Inject, Singleton } from 'typescript-ioc';
import UtenteService from '../services/utente.service';

@Singleton
export default class UtenteController {

  constructor(
    @Inject private utenteService: UtenteService,
  ) { }

  public async login(ctx: IRouterContext) {
    ctx.body = await this.utenteService.login(ctx.request.body);
  }

  public async logout(ctx: IRouterContext) {
    ctx.body = await this.utenteService.logout(ctx.body, ctx.request.get('token'));
  }

  public async logoutAll(ctx: IRouterContext) {
    ctx.body = await this.utenteService.logoutAll(ctx.body);
  }

  public async me(ctx: IRouterContext) {
    ctx.body = await this.utenteService.me(+ctx.request.get('id'), ctx.request.get('token'));
  }

  public async update(ctx: IRouterContext) {
    ctx.body = await this.utenteService.update(ctx.body);
  }

  public async delete(ctx: IRouterContext) {
    ctx.body = await this.utenteService.delete(+ctx.request.get('id'));
  }

}
