import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import TipoSpesaService from "../services/tipo-spesa.service";

@Singleton
export default class TipoSpesaController {
  constructor(@Inject private tipoSpesaService: TipoSpesaService) {}

  public async getAllTipoSpesas(ctx: IRouterContext) {
    ctx.body = await this.tipoSpesaService.findAll();
  }

  public async findTipoSpesaById(ctx: IRouterContext) {
    try {
      ctx.body = await this.tipoSpesaService.findById(ctx.params.id);
    } catch (e) {
      ctx.throw(404);
    }
  }
}
