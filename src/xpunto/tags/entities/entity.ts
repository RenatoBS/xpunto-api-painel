import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TagDocument = Tag & Document;

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

export const TagSchema = SchemaFactory.createForClass(Tag);
