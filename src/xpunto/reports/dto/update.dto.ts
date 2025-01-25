import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {
  id?: string;
  type?: string;
  category?: string;
  description?: string;
  evidence?: string;
  status?: string;
  author?: string;
  indicted?: string;
  interest_id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
