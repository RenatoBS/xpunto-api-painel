import {
  Controller as NestController,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Service } from './service';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@NestController('subscriptions')
export class Controller {
  constructor(private readonly service: Service) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  create(@Body() createDto: CreateDto) {
    return this.service.create(createDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get('balance')
  balance() {
    return this.service.balance();
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Query() query) {
    return this.service.findAll(query);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: UpdateDto) {
    return this.service.update(id, updateDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
