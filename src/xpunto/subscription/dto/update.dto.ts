import { PartialType } from '@nestjs/mapped-types';
import { CreateDto } from './create.dto';

export class UpdateDto extends PartialType(CreateDto) {
  startedDate?: Date;
  active?: boolean;
  customerId?: string;
  subscriptionId?: string;
  userId?: string;
}
