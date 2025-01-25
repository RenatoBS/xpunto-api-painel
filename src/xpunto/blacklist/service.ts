import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Blacklist } from './entities/entity';
import { Repository } from 'typeorm';
import { mountFilter, parseImageProperty } from 'src/utils';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(Blacklist)
    private repository: Repository<Blacklist>,
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

  async findOne(id: string) {
    const user = new Blacklist();
    user.id = id;
    let result = await this.repository.findOneBy(user);
    result = parseImageProperty(result);
    return result;
  }

  update(id: string, updateDto: UpdateDto) {
    return this.repository.update(id, updateDto);
  }

  remove(id: string) {
    return this.repository.delete(id);
  }
}
