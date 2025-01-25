import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { Subscriptions, SubscriptionsDocument } from './entities/entity';
import { filterTag, mountFilter } from 'src/utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Stripe from 'stripe';

@Injectable()
export class Service {
  constructor(
    @InjectModel(Subscriptions.name)
    private model: Model<SubscriptionsDocument>,
  ) {}

  create(createDto: CreateDto) {
    return this.model.create(createDto);
  }

  async findAll(query) {
    try {
      const { order, where, skip, take } = mountFilter(query);
      const filter = filterTag(where);
      const [data, total] = await Promise.all([
        this.model
          .find(filter)
          .sort(order || ('value' as any))
          .skip(skip || 0)
          .limit(take || 100),
        this.model.count(filter).exec(),
      ]);
      return { data, total };
    } catch (error) {
      console.error('Error in find all subscription:', error);
      throw error;
    }
  }

  async findOne(_id: string) {
    return await this.model.findOne({ _id });
  }

  update(_id: string, updateDto: UpdateDto) {
    return this.model.updateOne({ _id }, updateDto);
  }

  remove(_id: string) {
    return this.model.deleteOne({ _id });
  }

  async balance() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const balance = await stripe.balance.retrieve();
    const products = await stripe.products.list();
    console.log(products);
    return balance;
  }

  async products() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const products = await stripe.products.list();
    return products;
  }
}
