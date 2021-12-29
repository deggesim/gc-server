import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Andamento from "../models/andamento";
import Subscription from "../models/subscription";
import AndamentoService from "../services/andamento.service";
import SubscriptionService from "../services/subscription.service";

@Singleton
export default class AndamentoController {
  constructor(
    @Inject private andamentoService: AndamentoService,
    @Inject private subscriptionService: SubscriptionService
  ) {}

  public async getAllAndamentos(ctx: IRouterContext) {
    ctx.body = await this.andamentoService.findAll();
  }

  public async findAndamentoById(ctx: IRouterContext) {
    try {
      ctx.body = await this.andamentoService.findById(ctx.params.id);
    } catch (e) {
      ctx.throw(404);
    }
  }

  public async updateAndamento(ctx: IRouterContext) {
    try {
      const andamento: Andamento = Andamento.newAndamento(ctx.request.body);
      if (String(ctx.params.id) !== String(andamento.$id)) {
        ctx.throw(400);
      }
      ctx.body = await this.andamentoService.update(andamento);
    } catch (e) {
      ctx.throw(400, e.message);
    }
  }

  public async saveAndamento(ctx: IRouterContext) {
    try {
      const andamento: Andamento = Andamento.newAndamento(ctx.request.body);
      const result = await this.andamentoService.save(andamento);

      const webpush = require("web-push");

      const vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY,
        privateKey: process.env.VAPID_PRIVATE_KEY,
      };

      webpush.setVapidDetails(
        "mailto:simone.degennaro@yahoo.it",
        vapidKeys.publicKey,
        vapidKeys.privateKey
      );

      const allSubscription = await this.subscriptionService.findAll();
      allSubscription.forEach((sub: Subscription) => {
        const obj = JSON.parse(sub.$content);
        var pushConfig = {
          endpoint: obj.endpoint,
          keys: {
            auth: obj.keys.auth,
            p256dh: obj.keys.p256dh,
          },
        };

        // Create our number formatter.
        var formatter = new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        });
        const value = formatter.format(andamento.$costo);

        webpush
          .sendNotification(
            pushConfig,
            JSON.stringify({
              title: "Nuova spesa",
              content: `${andamento.$tipoSpesa.$descrizione} - ${andamento.$descrizione} - ${value}`,
            })
          )
          .catch(function (err: any) {
            console.log(err);
          });
      });

      ctx.body = result;
      ctx.status = 201;
    } catch (e) {
      ctx.throw(400, e.message);
    }
  }

  public async deleteAndamento(ctx: IRouterContext) {
    try {
      await this.andamentoService.delete(ctx.params.id);
      ctx.status = 200;
    } catch (e) {
      ctx.throw(404, e.message);
    }
  }
}
