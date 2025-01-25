import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Notifications } from './entities/entity';
import { Like, Repository } from 'typeorm';
import {
  transformToLikeQuery,
  mountFilter,
  parseImageProperty,
} from 'src/utils';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(Notifications)
    private repository: Repository<Notifications>,
    private readonly httpService: HttpService,
  ) {}

  create(createDto: CreateDto) {
    return this.repository.save(createDto);
  }

  async findAll(query?) {
    const filter = mountFilter(query);
    const where = transformToLikeQuery(filter.where);

    filter.where.length > 0
      ? (filter.where = filter.where.map((e) => {
          if (e.title) return { ...e, title: Like(`%${e.title}%`) };
          if (e.body) return { ...e, body: Like(`%${e.body}%`) };
          if (e.category) return { ...e, category: Like(`%${e.category}%`) };
          return e;
        }))
      : {};
    const [result, total] = await this.repository.findAndCount({
      ...(filter as any),
      where,
    });

    return {
      data: parseImageProperty(result),
      total,
    };
  }
  findOne(id: string) {
    const user = new Notifications();
    user.id = id;
    return this.repository.findOneBy(user);
  }

  update(id: string, updateDto: UpdateDto) {
    return this.repository.update(id, updateDto);
  }

  remove(id: string) {
    return this.repository.delete(id);
  }
  async countCategories({
    startDate = '2021-01-01T00:00:00.000Z',
    endDate = new Date().toISOString(),
  }) {
    const categories = ['Deu XPUNTO!', 'XPUNTO PROXIMO!'];
    const [
      sentCategoryCounts,
      notSentCategoryCounts,
      othersCategoryCounterSent,
      othersCategoryCounterNotSent,
    ] = await Promise.all([
      this.repository
        .createQueryBuilder('notifications')
        .select('title, COUNT(title) as count')
        .groupBy('title')
        .where('title IN (:...categories) AND sent = 1', { categories })
        .andWhere('notifications.createdAt >= :startDate', { startDate })
        .andWhere('notifications.createdAt <= :endDate', { endDate })
        .getRawMany(),
      this.repository
        .createQueryBuilder('notifications')
        .select('title, COUNT(title) as count')
        .groupBy('title')
        .where('title IN (:...categories) AND sent = 0', { categories })
        .andWhere('notifications.createdAt >= :startDate', { startDate })
        .andWhere('notifications.createdAt <= :endDate', { endDate })
        .getRawMany(),
      this.repository
        .createQueryBuilder('notifications')
        .select('COUNT(title) as count')
        .where('title NOT IN (:...categories) AND sent = 1', { categories })
        .andWhere('notifications.createdAt >= :startDate', { startDate })
        .andWhere('notifications.createdAt <= :endDate', { endDate })
        .getRawOne(),
      this.repository
        .createQueryBuilder('notifications')
        .select('COUNT(title) as count')
        .where('title NOT IN (:...categories) AND sent = 0', { categories })
        .andWhere('notifications.createdAt >= :startDate', { startDate })
        .andWhere('notifications.createdAt <= :endDate', { endDate })
        .getRawOne(),
    ]);

    const data = [];
    const result = [];

    sentCategoryCounts.forEach((entry) => {
      data.push({
        title: entry.title,
        sent: parseInt(entry.count),
      });
    });

    notSentCategoryCounts.forEach((entry) => {
      const category = data.find((e) => e.title == entry.title);
      result.push({
        ...category,
        notSent: parseInt(entry.count),
        total: parseInt(entry.count) + parseInt(category.sent),
      });
    });
    result.push({
      title: 'Chat',
      sent: parseInt(othersCategoryCounterSent.count),
      notSent: parseInt(othersCategoryCounterNotSent.count),
      total:
        parseInt(othersCategoryCounterSent.count) +
        parseInt(othersCategoryCounterNotSent.count),
    });

    return {
      total: result.reduce((accumulator, { total }) => accumulator + total, 0),
      data: result,
    };
  }

  async sendNotification(title, body, to) {
    const response = await this.httpService.axiosRef
      .post(
        'https://xpunto-api-notification.herokuapp.com/v1/notification/direct',
        { title, body, to, password: 'Tarcizo2398' },
        {
          headers: {
            Authorization:
              'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjAyYzljMjRmLWYyZGQtNDY5Ny05NDdmLTUxYzhmNGM2MzY5MSIsIm5hbWUiOiJSZW5hdG8iLCJtYWlsIjoicmVuYXRvYnJ1bm8xMzRAZ21haWwuY29tIn0.-Q26jh3GV_IefpyPryj2ev6mIg_TpVn0W-59p4Bzjh0',
          },
        },
      )
      .catch(({ response }) => response);
    return response;
  }
}
