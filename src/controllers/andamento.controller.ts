import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Andamento from "../models/andamento";
import AndamentoService from "../services/andamento.service";

@Singleton
export default class AndamentoController {
  constructor(@Inject private andamentoService: AndamentoService) {}

  public async getAllAndamentos(ctx: IRouterContext) {
    ctx.body = await this.andamentoService.findAll();
  }

  public async findAndamentoById(ctx: IRouterContext) {
    try {
      ctx.body = await this.andamentoService.findById(+ctx.params.id);
    } catch (e) {
      ctx.throw(404);
    }
  }

  public async updateAndamento(ctx: IRouterContext) {
    try {
      ctx.body = await this.andamentoService.update(
        ctx.request.body as Andamento
      );
    } catch (e) {
      ctx.throw(400, (e as any).message);
    }
  }

  public async saveAndamento(ctx: IRouterContext) {
    try {
      const result = await this.andamentoService.save(
        ctx.request.body as Andamento
      );
      ctx.body = result;
      ctx.status = 201;
    } catch (e) {
      ctx.throw(400, (e as any).message);
    }
  }

  public async deleteAndamento(ctx: IRouterContext) {
    try {
      await this.andamentoService.delete(+ctx.params.id);
      ctx.status = 200;
    } catch (e) {
      ctx.throw(404, (e as any).message);
    }
  }
}
