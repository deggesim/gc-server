import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Subscription from "../models/subscription";
import SubscriptionService from "../services/subscription.service";

@Singleton
export default class SubscriptionController {
  constructor(@Inject private subscriptionService: SubscriptionService) {}

  public async subscribe(ctx: IRouterContext) {
    try {
      const subscription = JSON.stringify(ctx.request.body);
      const obj = Subscription.newSubscription({subscription});
      const result = await this.subscriptionService.save(obj);
      ctx.body = result;
      ctx.status = 201;
    } catch (e) {
      ctx.throw(400, e.message);
    }
    
  }
}
