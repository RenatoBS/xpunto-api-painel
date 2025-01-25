import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service';
import { Controller } from './controller';
import { Notifications } from './entities/entity';
import { HttpModule } from '@nestjs/axios';

@NestModule({
  imports: [TypeOrmModule.forFeature([Notifications]), HttpModule],
  controllers: [Controller],
  providers: [Service],
  exports: [TypeOrmModule],
})
export class Module {}
