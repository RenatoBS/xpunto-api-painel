import { Injectable } from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { Admin, AdminDocument } from './entities/entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UpdateDto } from './dto/update.dto';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class Service {
  constructor(
    @InjectModel(Admin.name)
    private model: Model<AdminDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(createDto: CreateDto) {
    const createdUser = new this.model(createDto);
    return createdUser.save();
  }

  async findAll(query?) {
    return this.model.find(query).exec();
  }

  async findOne(id: string) {
    return this.model.findById(id);
  }

  async findByUsername(username: string): Promise<AdminDocument> {
    return this.model.findOne({ username }).exec();
  }

  async update(id: string, updateUserDto: UpdateDto): Promise<AdminDocument> {
    return this.model
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<AdminDocument> {
    return this.model.findByIdAndDelete(id).exec();
  }
  async externalServicesHealthcheck() {
    const [{ status: xpunto }, { status: notification }, { status: match }] =
      await Promise.all([
        this.httpService.axiosRef
          .get('https://xpunto.herokuapp.com/healthcheck')
          .catch(({ response }) => response),
        this.httpService.axiosRef
          .get('https://xpunto-api-notification.herokuapp.com/healthcheck')
          .catch(({ response }) => response),
        this.httpService.axiosRef
          .get('https://xpunto-api-match.herokuapp.com/healthcheck')
          .catch(({ response }) => response),
      ]);

    return {
      'Main Services': xpunto === 200 ? 'Online' : 'Offline',
      'Notification Services': notification === 200 ? 'Online' : 'Offline',
      'Match Services': match === 200 ? 'Online' : 'Offline',
    };
  }
}
