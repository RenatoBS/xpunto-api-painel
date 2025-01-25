/* eslint-disable @typescript-eslint/no-var-requires */
import { DataSourceOptions } from 'typeorm';
import { Users } from './xpunto/users/entities/entity';
import { Interests } from './xpunto/interests/entities/entity';
import { Reports } from './xpunto/reports/entities/entity';
import { Notifications } from './xpunto/notifications/entities/entity';
import { Blacklist } from './xpunto/blacklist/entities/entity';
import { Recovery } from './xpunto/recovery/entities/entity';
require('dotenv').config();

export const config: DataSourceOptions = {
  type: `mysql`,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  extra: {
    connectionLimit: 1,
  },
  entities: [Users, Interests, Reports, Notifications, Blacklist, Recovery],
};
