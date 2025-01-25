import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Interest,
  InterestDocument,
  Interests,
  Tag,
  TagDocument,
} from './entities/entity';
import { Repository } from 'typeorm';
import { mountFilter, mountLikeFilter, parseImageProperty } from 'src/utils';
import { addMatchInformation, interestTypesNew } from './uteis';
import { Users } from '../users/entities/entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(Interests)
    private repository: Repository<Interests>,
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectModel(Tag.name)
    private tagModel: Model<TagDocument>,
    @InjectModel(Interest.name)
    private model: Model<InterestDocument>,
  ) {}

  create(createInterestsDto: CreateDto) {
    return this.repository.save(createInterestsDto);
  }

  async findAll(query?) {
    const filter = mountFilter(query) as any;
    const match = filter.where.match;
    match ? delete filter.where.match : null;
    filter?.order?.preTitle ? delete filter.order.preTitle : null;

    Array.isArray(filter.where)
      ? (filter.where = filter.where.map(mountLikeFilter))
      : (filter.where = mountLikeFilter(filter.where));

    let [result, total] = await this.repository.findAndCount({
      ...(filter as any),
    });
    match ? ([result, total] = await this.getMatchsFromFirst(filter)) : false;
    return {
      data: parseImageProperty(result),
      total,
    };
  }

  async getMatchsFromFirst(filter) {
    const interestId = filter.where.id;
    const interestsMatch = await this.findInterestsMatchById(interestId);
    const { matchs: data, total } = interestsMatch[0];
    return [data, total];
  }

  async findInterestsMatchById(interestId: string) {
    const interest = await this.findOne(interestId);

    if (!interest) {
      throw new Error('Interest not found');
    }
    const binary = (type, subType) => {
      if (type !== 'social' && subType === 'pacive') return 'active';
      if (type !== 'social' && subType === 'active') return 'pacive';

      return subType;
    };
    const splitTags = interest.tags.split(',');
    const subType = binary(interest.type, interest.subType);
    const results = await this.repository
      .createQueryBuilder('interests')
      .andWhere((qb) => {
        splitTags.forEach((tag, index) => {
          if (index === 0) {
            qb.where('interests.tags LIKE :tag', { tag: `%${tag}%` });
          } else {
            qb.orWhere('interests.tags LIKE :tag', { tag: `%${tag}%` });
          }
        });
      })
      .where('interests.type = :type', { type: interest.type })
      .andWhere('interests.subType = :subType', { subType })
      .andWhere('interests.activated = true')
      .andWhere('interests.user_id != :userId', { userId: interest.user_id })
      .getMany();

    const interestWithMatchRelated = {
      my: interest,
      matchs: results,
    };
    const response = addMatchInformation([interestWithMatchRelated]);
    return response;
  }

  async findOne(id: string) {
    const interest = new Interests();
    interest.id = id;
    let result = await this.repository.findOneBy(interest);
    result = parseImageProperty(result);
    return result;
  }

  async getCountByType(
    startDate: string = '2021-01-01T00:00:00.000Z',
    endDate: string = new Date().toISOString(),
  ) {
    const data = await this.repository
      .createQueryBuilder('interests')
      .select([
        'interests.type as type',
        'interests.subType as subtype',
        'COUNT(interests.id) as typeCount',
      ])
      .where('interests.createdAt >= :startDate', { startDate })
      .andWhere('interests.createdAt <= :endDate', { endDate })
      .groupBy('interests.type, interests.subtype')
      .getRawMany();

    const response = data.map((r) => ({
      ...r,
      typeCount: parseInt(r.typeCount),
      color: interestTypesNew
        .find((t) => t.type == r.type)
        .subTypes.find((st) => st.name == r.subtype)?.color,
      description: interestTypesNew
        .find((t) => t.type == r.type)
        .subTypes.find((st) => st.name == r.subtype)?.description,
    }));

    return response;
  }
  async getTotal(
    startDate: string = '2021-01-01T00:00:00.000Z',
    endDate: string = new Date().toISOString(),
  ) {
    const result = await this.repository
      .createQueryBuilder('interests')
      .select(['COUNT(*) as total'])
      .where('interests.createdAt >= :startDate', { startDate })
      .andWhere('interests.createdAt <= :endDate', { endDate })
      .getRawOne();

    return result;
  }
  async getUserWithInterestCount(
    startDate: string = '2021-01-01T00:00:00.000Z',
    endDate: string = new Date().toISOString(),
  ) {
    const result = await this.userRepository
      .createQueryBuilder('users')
      .select(['COUNT(DISTINCT users.id) as totalUserWithInterestCount'])
      .innerJoin('interests', 'i', 'users.id = i.user_id')
      .where('users.createdAt >= :startDate', { startDate })
      .andWhere('users.createdAt <= :endDate', { endDate })
      .getRawOne();
    return result;
  }
  async getUsers(
    startDate: string = '2021-01-01T00:00:00.000Z',
    endDate: string = new Date().toISOString(),
  ) {
    const result = await this.userRepository
      .createQueryBuilder('users')
      .select(['COUNT(*) as users'])
      .where('users.createdAt >= :startDate', { startDate })
      .andWhere('users.createdAt <= :endDate', { endDate })
      .getRawOne();
    return result;
  }

  async getTagCount(
    startDate: string = '2021-01-01T00:00:00.000Z',
    endDate: string = new Date().toISOString(),
  ) {
    try {
      const tagCount = await this.tagModel.countDocuments({
        createdAt: { $gte: startDate, $lte: endDate },
      });

      return tagCount;
    } catch (error) {
      console.error('Error in getTagCount:', error);
      throw error;
    }
  }

  async getDashboardInfo({ startDate, endDate }) {
    const [
      interestChartData,
      { total },
      { users },
      { totalUserWithInterestCount },
      tags,
    ] = await Promise.all([
      this.getCountByType(startDate, endDate),
      this.getTotal(startDate, endDate),
      this.getUsers(startDate, endDate),
      this.getUserWithInterestCount(startDate, endDate),
      this.getTagCount(startDate, endDate),
    ]);
    const avg = (total / users).toFixed(2);
    return {
      interests: parseInt(total),
      avg,
      tags,
      totalUserWithInterestCount: parseInt(totalUserWithInterestCount),
      interestChartData,
    };
  }

  async update(id: string, updateInterestsDto: Partial<UpdateDto | any>) {
    delete updateInterestsDto?.preTitle;
    await this.model.updateOne(
      { interestId: id },
      { ...updateInterestsDto, id: undefined },
    );
    return this.repository.update(id, updateInterestsDto);
  }

  remove(id: string) {
    this.model.deleteOne({ interestId: id });
    return this.repository.delete(id);
  }
}
