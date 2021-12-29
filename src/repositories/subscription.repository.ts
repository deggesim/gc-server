import { Singleton } from "typescript-ioc";
import Subscription from "../models/subscription";
import IRepository from "./repository";

@Singleton
export default class SubscriptionRepository extends IRepository {
  public async saveSubscription(
    subscription: Subscription
  ): Promise<Subscription> {
    return this.getSubscriptionRepository().save(subscription);
  }

  public async getAll(): Promise<Subscription[]> {
    return this.getSubscriptionRepository()
      .createQueryBuilder("subscription")
      .getMany();
  }
}
