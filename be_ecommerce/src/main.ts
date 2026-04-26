import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import 'dayjs/locale/vi';
import { ValidationPipe } from '@nestjs/common';
import 'reflect-metadata';
import {
  addTransactionalDataSource,
  initializeTransactionalContext,
} from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import cookieParser from 'cookie-parser';
import * as express from 'express';

async function bootstrap() {
  const isDev = process.env.ENVIRONMENT_APP === 'development';
  initializeTransactionalContext();
  const app = await NestFactory.create(AppModule, {
    logger: !isDev ? ['error', 'warn'] : ['log', 'debug', 'error', 'warn'],
  });
  const dataSource = app.get(DataSource);
  addTransactionalDataSource(dataSource)
  dayjs.extend(isLeapYear);
  dayjs.locale('vi');
  app.setGlobalPrefix('api');
  // set debug validate
  app.useGlobalPipes(
    new ValidationPipe({
      transform: isDev,
      whitelist: isDev,
      disableErrorMessages: !isDev,
      enableDebugMessages: isDev,
    }),
  );
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  app.use(cookieParser());
  app.use('/uploads', express.static('uploads'));
  await app.listen(process.env.ENVIRONMENT_PORT ?? 3000);
}
bootstrap();
