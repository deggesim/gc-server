import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import Andamento from "../models/andamento";
import Subscription from "../models/subscription";
import AndamentoService from "../services/andamento.service";
import SubscriptionService from "../services/subscription.service";
import * as webpush from "web-push";

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

      const vapidKeys = {
        publicKey: process.env.VAPID_PUBLIC_KEY
          ? process.env.VAPID_PUBLIC_KEY
          : "",
        privateKey: process.env.VAPID_PRIVATE_KEY
          ? process.env.VAPID_PRIVATE_KEY
          : "",
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
        const formatter = new Intl.NumberFormat("it-IT", {
          style: "currency",
          currency: "EUR",
        });
        const value = formatter.format(andamento.$costo);

        const payload = {
          notification: {
            title: "Nuova spesa",
            body: `${andamento.$tipoSpesa.$descrizione} - ${andamento.$descrizione} - ${value}`,
            icon: "assets/icons/icon-96x96.png",
            badge: "assets/icons/icon-96x96.png",
            vibrate: [100, 50, 200],
            lang: "it-IT", // BCP 47,
            tag: "nuova-spesa",
            renotify: true,
            data: {
              onActionClick: {
                default: { operation: "navigateLastFocusedOrOpen", url: "/lista" },
              },
            },
          },
        };

        webpush
          .sendNotification(pushConfig, JSON.stringify(payload))
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
