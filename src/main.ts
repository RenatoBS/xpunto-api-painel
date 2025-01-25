/* eslint-disable @typescript-eslint/no-var-requires */
import { NestFactory } from '@nestjs/core';
import { Module } from './app.module';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create(Module, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose', 'fatal'],
  });

  app.enableCors();
  await app.listen(process.env.PORT);
}
bootstrap();
