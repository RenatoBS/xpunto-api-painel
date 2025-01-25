import { Module as NestModule } from '@nestjs/common';
import { Service } from './service';
import { Service as DeleteService } from './delete-service';
import { Controller } from './controller';
import { Admin, AdminSchema } from './entities/entity';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';
import { Module as UserModule } from '../../xpunto/users/module';
import { Module as InterestModule } from '../../xpunto/interests/module';
import {
  Location,
  LocationSchema,
  User,
  UserSchema,
} from 'src/xpunto/users/entities/entity';
@NestModule({
  imports: [
    UserModule,
    InterestModule,
    MongooseModule.forFeature([{ name: Admin.name, schema: AdminSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
    HttpModule,
  ],
  controllers: [Controller],
  providers: [Service, DeleteService],
  exports: [Service],
})
export class Module {}
