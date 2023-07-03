import { IRouterContext } from "koa-router";
import { Inject, Singleton } from "typescript-ioc";
import { Interval } from "../models/interval";
import StatisticheService from "../services/statistiche.service";

@Singleton
export default class StatisticheController {
  constructor(@Inject private statisticheService: StatisticheService) {}

  public async speseFrequenti(ctx: IRouterContext) {
    ctx.body = await this.statisticheService.speseFrequenti(
      ctx.params.interval as Interval
    );
  }

  public async spesa(ctx: IRouterContext) {
    ctx.body = await this.statisticheService.spesa(
      ctx.params.interval as Interval
    );
  }

  public async carburante(ctx: IRouterContext) {
    ctx.body = await this.statisticheService.carburante(
      ctx.params.interval as Interval
    );
  }

  public async bolletta(ctx: IRouterContext) {
    ctx.body = await this.statisticheService.bolletta(
      ctx.params.interval as Interval
    );
  }

  public async casa(ctx: IRouterContext) {
    ctx.body = await this.statisticheService.casa(
      ctx.params.interval as Interval
    );
  }
}
