import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  configDotenv({
    path: '../.env.local'
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(6969);
}
bootstrap();
