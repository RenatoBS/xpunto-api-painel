import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service';
import { Controller } from './controller';
import { Blacklist } from './entities/entity';

@NestModule({
  imports: [TypeOrmModule.forFeature([Blacklist])],
  controllers: [Controller],
  providers: [Service],
  exports: [TypeOrmModule],
})
export class Module {}
