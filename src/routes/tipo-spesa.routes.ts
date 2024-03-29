import { IRouterContext } from "koa-router";
import { Inject } from "typescript-ioc";
import TipoSpesaController from "../controllers/tipo-spesa.controller";
import Route from "../models/route";
import IRoutes from "./routes";

export default class TipoSpesaRoutes extends IRoutes {
  constructor(@Inject private directorController: TipoSpesaController) {
    super();
  }

  protected getRoutes(): Route[] {
    return [
      Route.newRoute("/tipo-spesa", "get", (ctx: IRouterContext) =>
        this.directorController.getAllTipoSpesas(ctx)
      ),
      Route.newRoute("/tipo-spesa/:id", "get", (ctx: IRouterContext) =>
        this.directorController.findTipoSpesaById(ctx)
      ),
    ];
  }
}
