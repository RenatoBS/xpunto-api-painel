import {
  Controller as NestController,
  Get,
  Body,
  Put,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Service } from './service';
import { Service as DeleteService } from './delete-service';
import { UpdateDto } from './dto/update.dto';
import { AccessTokenGuard } from 'src/common/guards/accessToken.guard';

@NestController('admin')
export class Controller {
  constructor(
    private readonly service: Service,
    private readonly deleteService: DeleteService,
  ) {}

  @UseGuards(AccessTokenGuard)
  @Get()
  findAll(@Query() query) {
    return this.service.findAll(query);
  }
  @UseGuards(AccessTokenGuard)
  @Get('/health')
  externalServicesHealthcheck() {
    return this.service.externalServicesHealthcheck();
  }

  @UseGuards(AccessTokenGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateDto) {
    return this.service.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('delete/:id')
  delete(@Param('id') id: string) {
    return this.deleteService.deleteUser(id);
  }
}
