import {
  Module as NestCommonModule,
  MiddlewareConsumer,
  NestModule,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Module as UsersModule } from './xpunto/users/module';
import { Module as InterestsModule } from './xpunto/interests/module';
import { Module as ReportsModules } from './xpunto/reports/module';
import { Module as NotificationsModule } from './xpunto/notifications/module';
import { Module as BlacklistModule } from './xpunto/blacklist/module';
import { Module as RecoveryModule } from './xpunto/recovery/module';
import { Module as TagsModule } from './xpunto/tags/module';
import { Module as SubscriptionModule } from './xpunto/subscription/module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './ormconfig';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { RequestLoggerMiddleware } from './common/request-logger.middleware';

@NestCommonModule({
  imports: [
    UsersModule,
    InterestsModule,
    NotificationsModule,
    RecoveryModule,
    BlacklistModule,
    ReportsModules,
    TagsModule,
    SubscriptionModule,
    TypeOrmModule.forRoot(config),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
  ],
})
export class Module implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}
