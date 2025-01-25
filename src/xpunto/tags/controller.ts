import {
  Controller as NestController,
  Get,
  UseGuards,
  Query,
  Param,
} from '@nestjs/common';
import { Service } from './service';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@NestController('tags')
export class Controller {
  constructor(private readonly service: Service) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Query() query) {
    return this.service.findAll(query);
  }
  @Get('/:id')
  findOne(@Param('id') id) {
    return this.service.findOne(id);
  }
}
