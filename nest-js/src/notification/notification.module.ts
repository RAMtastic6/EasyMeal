import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from './entities/notification.entity';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService],
  imports: [
    TypeOrmModule.forFeature([Notification]),
    AuthenticationModule
  ],
  exports: [NotificationService, TypeOrmModule]
})
export class NotificationModule {}
