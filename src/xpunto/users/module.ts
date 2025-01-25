import { Module as NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Service } from './service';
import { Controller } from './controller';
import {
  Location,
  LocationSchema,
  User,
  UserSchema,
  Users,
} from './entities/entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@NestModule({
  imports: [
    CacheModule.register({
      ttl: 30,
    }),
    TypeOrmModule.forFeature([Users]),
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [Controller],
  providers: [
    Service,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
  exports: [TypeOrmModule],
})
export class Module {}
