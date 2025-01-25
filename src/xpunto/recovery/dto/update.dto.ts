import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {
  id?: string;
  code?: string;
  mail?: string;
  createdAt?: Date;
  updatedAt?: Date;
  used?: boolean;
}
