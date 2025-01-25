import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {
  id?: string;
  category?: string;
  word?: string;
  activated?: boolean;
}
