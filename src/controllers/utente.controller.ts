import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import UtenteService from "../services/utente.service";

@Singleton
export default class UtenteController {
  constructor(@Inject private utenteService: UtenteService) {}

  public async create(ctx: IRouterContext) {
    try {
      ctx.body = await this.utenteService.create(ctx.request.body);
      ctx.status = 201;
    } catch (error) {
      ctx.throw(400, "Impossibile creare un nuovo utente");
    }
  }

  public async login(ctx: IRouterContext) {
    try {
      ctx.body = await this.utenteService.login(ctx.request.body);
    } catch (e) {
      ctx.throw(401, (e as any).message);
    }
  }

  public async logout(ctx: IRouterContext) {
    ctx.body = await this.utenteService.logout(
      ctx.state.utente,
      ctx.state.token
    );
  }

  public async logoutAll(ctx: IRouterContext) {
    ctx.body = await this.utenteService.logoutAll(ctx.state.utente);
  }

  public async me(ctx: IRouterContext) {
    ctx.body = ctx.state.utente;
  }

  public async update(ctx: IRouterContext) {
    try {
      ctx.body = await this.utenteService.update(ctx.request.body);
    } catch (e) {
      ctx.throw(400, (e as any).message);
    }
  }

  public async delete(ctx: IRouterContext) {
    try {
      ctx.body = await this.utenteService.delete(ctx.state.utente.id);
    } catch (e) {
      ctx.throw(404, (e as any).message);
    }
  }
}
