import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag, TagDocument } from './entities/entity';
import { filterTag, mountFilter } from 'src/utils';

@Injectable()
export class Service {
  constructor(
    @InjectModel(Tag.name)
    private model: Model<TagDocument>,
  ) {}

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
      console.error('Error in find all tags:', error);
      throw error;
    }
  }

  async findOne(_id: string) {
    const data = await this.model.find({ _id }).exec();
    return { data };
  }
}
