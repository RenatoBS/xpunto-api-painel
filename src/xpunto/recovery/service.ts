import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Recovery } from './entities/entity';
import { Repository } from 'typeorm';
import { mountFilter, parseImageProperty } from 'src/utils';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(Recovery)
    private repository: Repository<Recovery>,
  ) {}

  create(createDto: CreateDto) {
    return this.repository.save(createDto);
  }

  async findAll(query?) {
    const filter = mountFilter(query);
    const [result, total] = await this.repository.findAndCount({
      ...(filter as any),
    });

    return {
      data: parseImageProperty(result),
      total,
    };
  }

  findOne(id: string) {
    const user = new Recovery();
    user.id = id;
    return this.repository.findOneBy(user);
  }

  update(id: string, updateDto: UpdateDto) {
    return this.repository.update(id, updateDto);
  }

  remove(id: string) {
    return this.repository.delete(id);
  }
}
