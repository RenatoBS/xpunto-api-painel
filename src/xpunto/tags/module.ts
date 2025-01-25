import { Module as NestModule } from '@nestjs/common';
import { Service } from './service';
import { Controller } from './controller';
import { Tag, TagSchema } from './entities/entity';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule, CacheInterceptor } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';

@NestModule({
  imports: [
    CacheModule.register({
      ttl: 30,
    }),
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
  ],
  controllers: [Controller],
  providers: [
    Service,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class Module {}
