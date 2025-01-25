import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {
  id?: string;
  name?: string;
  mail?: string;
  password?: string;
  zipcode?: string;
  image?: string;
  facebook?: string;
  phone?: string;
  activate?: boolean;
}
