import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionsDocument = Subscriptions & Document;

@Schema()
export class Subscriptions {
  @Prop({ default: new Date() })
  startedDate: Date;
  @Prop({ default: true })
  active: boolean;
  @Prop()
  customerId: string;
  @Prop()
  userId: string;
  @Prop()
  subscriptionId: string;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscriptions);
