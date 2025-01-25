import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  mail: string;
  @Column()
  gender: string;
  @Column()
  country: string;
  @Column()
  birth: Date;
  @Column()
  password: string;
  @Column()
  zipcode: string;
  @Column()
  image: string;
  @Column()
  facebook: string;
  @Column()
  phone: string;
  @Column()
  activated: boolean;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}

export type LocationDocument = Location & Document;

@Schema()
export class Location {
  @Prop({ required: true })
  lat: number;
  @Prop({ required: true })
  lng: number;
  @Prop({ required: true })
  userId: string;
  @Prop()
  precise: boolean;
  @Prop()
  city: string;
  @Prop()
  state: string;
  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: ObjectId;
}

export type UserDocument = Location & Document;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  mail: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  gender: string;
  @Prop({ required: true })
  country: string;
  @Prop({ required: true })
  birth: Date;
  @Prop({ required: true, select: false })
  password: string;
  @Prop({ required: true })
  zipcode: string;
  @Prop({})
  image: string;
  @Prop({})
  facebook: string;
  @Prop({ required: true })
  phone: string;
  @Prop({ required: true })
  activated: boolean;
  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Location.name })
  location: ObjectId;
}

export const LocationSchema = SchemaFactory.createForClass(Location);
export const UserSchema = SchemaFactory.createForClass(User);
