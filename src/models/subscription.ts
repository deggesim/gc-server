import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('subscription')
export default class Subscription {
  @PrimaryGeneratedColumn()
  private id!: number;

  @Column({ nullable: false })
  private content!: string;

  public static newSubscription(obj: { id?: number; subscription?: string }): Subscription {
    const subscription = new Subscription();
    if (obj.id) subscription.id = obj.id;
    if (obj.subscription) subscription.content = obj.subscription;
    return subscription;
  }

  public get $id(): number {
    return this.id;
  }

  public set $id(id: number) {
    this.id = id;
  }

  public get $content(): string {
    return this.content;
  }

  public set $content(value: string) {
    this.content = value;
  }
}
