import { IRouterContext } from "koa-router";
import { Inject } from "typescript-ioc";
import SubscriptionController from "../controllers/subscription.controller";
import Route from "../models/route";
import IRoutes from "./routes";

export default class SubscriptionRoutes extends IRoutes {
  constructor(@Inject private subscriptionController: SubscriptionController) {
    super();
  }

  protected getRoutes(): Route[] {
    return [
      Route.newRoute("/subscription", "post", (ctx: IRouterContext) =>
        this.subscriptionController.subscribe(ctx)
      ),
    ];
  }
}
