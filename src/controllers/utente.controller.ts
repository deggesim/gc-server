import { IRouterContext } from 'koa-router';
import { Inject, Singleton } from 'typescript-ioc';
import UtenteService from '../services/utente.service';

@Singleton
export default class UtenteController {

  constructor(
    @Inject private utenteService: UtenteService,
  ) { }

  public async create(ctx: IRouterContext) {
    ctx.body = await this.utenteService.create(ctx.request.body);
    ctx.status = 201;
  }

  public async login(ctx: IRouterContext) {
    ctx.body = await this.utenteService.login(ctx.request.body);
  }

  public async logout(ctx: IRouterContext) {
    ctx.body = await this.utenteService.logout(ctx.state.utente, ctx.state.token);
  }

  public async logoutAll(ctx: IRouterContext) {
    ctx.body = await this.utenteService.logoutAll(ctx.state.utente);
  }

  public async me(ctx: IRouterContext) {
    ctx.body = ctx.state.utente;
  }

  public async update(ctx: IRouterContext) {
    ctx.body = await this.utenteService.update(ctx.state.utente);
  }

  public async delete(ctx: IRouterContext) {
    ctx.body = await this.utenteService.delete(ctx.state.utente.id);
  }

}
