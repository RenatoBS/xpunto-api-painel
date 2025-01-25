import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Location,
  LocationDocument,
  User,
  UserDocument,
  Users,
} from 'src/xpunto/users/entities/entity';
import { Repository } from 'typeorm';
import { Interests } from 'src/xpunto/interests/entities/entity';

@Injectable()
export class Service {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(Location.name)
    private locationModel: Model<LocationDocument>,
    @InjectRepository(Interests)
    private interestRepository: Repository<Interests>,
  ) {}

  async deleteUser(userId: string) {
    let filter1: any = { user_id: userId };
    let filter2: any = { userId };
    let filter3: any = { id: userId };
    if (userId.includes('@')) {
      const { id } = await this.userRepository.findOneBy({ mail: userId });
      filter1 = { user_id: id };
      filter2 = { userId: id };
      filter3 = { id };
    }

    await this.interestRepository.delete(filter1);
    await this.locationModel.deleteOne(filter2);
    await this.userModel.deleteOne(filter2);
    await this.userRepository.delete(filter3);
    console.warn(`User ${userId} deleted`);
  }
}
