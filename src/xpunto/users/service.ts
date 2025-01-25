import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { UpdateDto } from './dto/update.dto';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Location,
  LocationDocument,
  User,
  UserDocument,
  Users,
} from './entities/entity';
import { Repository } from 'typeorm';
import {
  filterStateAndCity,
  mountFilter,
  parseImageProperty,
} from '../../utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(Users)
    private repository: Repository<Users>,
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  create(createDto: CreateDto) {
    return this.repository.save(createDto);
  }

  async createSyncUser() {
    // cria lista de resultados
    const result = [];
    // buscando todos os dados do mssql
    const usersDB = await this.repository.find();
    console.debug('lista de usuarios: ', usersDB.length);
    //percorrendo lista de usuarios
    await Promise.all(
      usersDB.map(async (user, index) => {
        console.debug('Usuario: ', user.id);
        // pega localizacao
        const location = await this.locationModel.findOne({ userId: user.id });
        const newUser = {
          ...user,
          location: location._id,
          userId: user.id,
        };
        delete newUser.id;
        // cria novo usuario db
        const userMongoDB = await this.userModel.create(newUser);
        // add usuario a lista de resultados
        result.push(userMongoDB);
        console.debug(index);
      }),
    );
    return result;
  }

  hasLocationParamters(order, where) {
    const orderP =
      Object.keys(order).includes('state') ||
      Object.keys(order).includes('city');
    const whereP =
      Object.keys(where).length > 0 &&
      (Object.keys(where).includes('state') ||
        Object.keys(where).includes('city'));
    return orderP || whereP;
  }

  async findOne(id: string) {
    const user = new Users();
    user.id = id;
    let result = await this.repository.findOneBy(user);
    const local = (await this.locationModel.findOne({ userId: id })).toJSON();
    result = parseImageProperty(result);
    return { ...local, ...result };
  }

  async findAll(query) {
    const { order, where, skip, take } = mountFilter(query);
    const filter = filterStateAndCity(where);
    const aggregateFilter = [
      {
        $lookup: {
          from: 'locations',
          localField: 'location',
          foreignField: '_id',
          as: 'userLocations',
        },
      },
      {
        $unwind: '$userLocations',
      },
      {
        $match: filter,
      },
      {
        $project: {
          _id: 1,
          name: 1,
          mail: 1,
          gender: 1,
          country: 1,
          birth: 1,
          password: 1,
          zipcode: 1,
          image: 1,
          userId: 1,
          facebook: 1,
          phone: 1,
          activated: 1,
          createdAt: 1,
          updatedAt: 1,
          state: '$userLocations.state',
          city: '$userLocations.city',
          lat: '$userLocations.lat',
          lng: '$userLocations.lng',
          id: '$userLocations.userId',
          precise: '$userLocations.precise',
        },
      },
    ];
    const [[{ total } = { total: 100 }], users] = await Promise.all([
      this.userModel.aggregate(aggregateFilter).count('total'),
      this.userModel
        .aggregate(aggregateFilter)
        .sort(order || ('updatedAt' as any))
        .skip(skip || 0)
        .limit(take || 100),
    ]);
    return { data: users, total };
  }

  async update(id: string, updateDto: UpdateDto) {
    delete updateDto['_id'];
    await this.userModel.updateOne({ userId: id }, updateDto);

    delete updateDto['id'];
    delete updateDto['lat'];
    delete updateDto['lng'];
    delete updateDto['state'];
    delete updateDto['city'];
    delete updateDto['userId'];
    delete updateDto['user'];
    delete updateDto['__v'];
    delete updateDto['precise'];

    await this.repository.update(id, updateDto);
    return await this.repository.findBy({ id });
  }

  async remove(id: string) {
    await this.userModel.deleteOne({ userId: id }).exec();
    return await this.repository.delete(id);
  }

  getTotalPerWeek({
    startDate = '2021-01-01T00:00:00.000Z',
    endDate = new Date().toISOString(),
  }) {
    return this.repository.query(`
      SELECT
        DATE_FORMAT(
          DATE_ADD(createdAt, INTERVAL 6 - DAYOFWEEK(createdAt) DAY), 
          '%Y-%m-%d'
        ) AS date,
        COUNT(*) AS "total"
      FROM users
      WHERE createdAt BETWEEN '${startDate}' AND '${endDate}'
      GROUP BY date
      ORDER BY date;
    `);
  }
  async getTotalUsers() {
    const raws = await this.repository.query(
      `SELECT COUNT(*) AS total FROM users;`,
    );
    return raws[0];
  }
  async getTotalReports() {
    const raws = await this.repository.query(
      `SELECT COUNT(*) AS reports FROM reports;`,
    );
    return raws[0];
  }
  async getTotalReportsPerWeek({
    startDate = '2021-01-01T00:00:00.000Z',
    endDate = new Date().toISOString(),
  }) {
    const raws = await this.repository.query(
      `SELECT COUNT(*) AS reportsPerWeek FROM reports
      WHERE createdAt BETWEEN '${startDate}' AND '${endDate}';
      `,
    );
    return raws[0];
  }

  async getTotalUsersPerWeek({
    startDate = '2021-01-01T00:00:00.000Z',
    endDate = new Date().toISOString(),
  }) {
    const raws = await this.repository.query(
      `SELECT COUNT(*) AS totalPerWeek FROM users
      WHERE createdAt BETWEEN '${startDate}' AND '${endDate}';
      `,
    );
    return raws[0];
  }

  async getDashboardInfo(query) {
    const { startDate, endDate } = query;
    const [
      chartData,
      { total },
      { totalPerWeek },
      { reports },
      { reportsPerWeek },
    ] = await Promise.all([
      this.getTotalPerWeek({
        startDate,
        endDate,
      }),
      this.getTotalUsers(),
      this.getTotalUsersPerWeek({
        startDate,
        endDate,
      }),
      this.getTotalReports(),
      this.getTotalReportsPerWeek({
        startDate,
        endDate,
      }),
    ]);
    return {
      total,
      totalPerWeek,
      reports,
      reportsPerWeek,
      chartData,
    };
  }

  async getUsersEmail() {
    const users = await this.repository.find();
    const response = users.map(({ id, mail }) => ({ id, mail }));
    return response;
  }
}
