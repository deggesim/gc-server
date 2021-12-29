import { Inject, Singleton } from "typescript-ioc";
import Subscription from "../models/subscription";
import SubscriptionRepository from "../repositories/subscription.repository";

@Singleton
export default class SubscriptionService {
  constructor(@Inject private subscriptionRepository: SubscriptionRepository) {}

  public async save(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepository.saveSubscription(subscription);
  }

  public async findAll(): Promise<Subscription[]> {
    return this.subscriptionRepository.getAll();
  }
}
