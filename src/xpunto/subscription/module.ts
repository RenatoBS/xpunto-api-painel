import { Module as NestModule } from '@nestjs/common';
import { Service } from './service';
import { Controller } from './controller';
import { Subscriptions, SubscriptionSchema } from './entities/entity';
import { MongooseModule } from '@nestjs/mongoose';

@NestModule({
  imports: [
    MongooseModule.forFeature([
      { name: Subscriptions.name, schema: SubscriptionSchema },
    ]),
  ],
  controllers: [Controller],
  providers: [Service],
})
export class Module {}
