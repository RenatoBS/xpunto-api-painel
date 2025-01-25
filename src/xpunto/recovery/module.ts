import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service';
import { Controller } from './controller';
import { Recovery } from './entities/entity';

@NestModule({
  imports: [TypeOrmModule.forFeature([Recovery])],
  controllers: [Controller],
  providers: [Service],
  exports: [TypeOrmModule],
})
export class Module {}
