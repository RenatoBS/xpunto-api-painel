import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {
  id?: string;
  title?: string;
  tags?: string;
  description?: string;
  type?: string;
  subType?: string;
  images?: string;
  config?: string;
  user_id?: string;
  activated?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
