import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Entity()
export class Interests {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  title: string;
  @Column()
  tags: string;
  @Column()
  description: string;
  @Column()
  type: string;
  @Column()
  subType: string;
  @Column()
  images: string;
  @Column()
  config: string;
  @Column()
  user_id: string;
  @Column()
  activated: boolean;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}

@Schema()
export class Image {
  @Prop()
  imageId: string;

  @Prop()
  path: string;

  @Prop()
  url: string;

  @Prop()
  updatedAt: Date;
}

export const ImageSchema = SchemaFactory.createForClass(Image);

@Schema({ timestamps: true })
export class Interest {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true, unique: true })
  interestId: string;

  @Prop({ type: ImageSchema })
  image1: Image;

  @Prop({ type: ImageSchema })
  image2: Image;

  @Prop({ type: ImageSchema })
  image3: Image;

  @Prop({ type: ImageSchema })
  image4: Image;

  @Prop({ type: ImageSchema })
  image5: Image;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Tag' }] })
  tags: Types.ObjectId[];

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  type: string;

  @Prop()
  subType: string;

  @Prop()
  config: string;

  @Prop()
  activated: boolean;

  @Prop({ default: () => new Date() })
  createdAt: Date;

  @Prop({ default: () => new Date() })
  updatedAt: Date;
}

@Schema()
export class Tag {
  @Prop({ required: true, unique: true })
  value: string;
  @Prop({ type: Array, ref: 'interest' })
  interests: any;
  @Prop({ default: new Date() })
  createdAt: Date;
  @Prop({ default: new Date() })
  updatedAt: Date;
}

export type InterestDocument = Interest & Document;
export const InterestSchema = SchemaFactory.createForClass(Interest);

export type TagDocument = Tag & Document;
export const TagSchema = SchemaFactory.createForClass(Tag);
