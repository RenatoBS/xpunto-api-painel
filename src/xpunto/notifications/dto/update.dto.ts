import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {
  id?: string;
  messageId?: string;
  category?: string;
  title?: string;
  body?: string;
  relation?: string;
  image?: string;
  sent?: boolean;
  createdAt?: Date;
}
