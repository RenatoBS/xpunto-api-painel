import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service';
import { Controller } from './controller';
import {
  Interest,
  Interests,
  InterestSchema,
  Tag,
  TagSchema,
} from './entities/entity';
import { Users } from '../users/entities/entity';
import { MongooseModule } from '@nestjs/mongoose';

@NestModule({
  imports: [
    TypeOrmModule.forFeature([Interests]),
    TypeOrmModule.forFeature([Users]),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    MongooseModule.forFeature([
      { name: Interest.name, schema: InterestSchema },
    ]),
  ],
  controllers: [Controller],
  providers: [Service],
  exports: [TypeOrmModule],
})
export class Module {}
