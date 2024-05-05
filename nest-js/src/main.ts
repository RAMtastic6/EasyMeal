import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configDotenv } from 'dotenv';

async function bootstrap() {
  configDotenv({
    path: '../.env.local'
  });
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(6969);
}
bootstrap();
