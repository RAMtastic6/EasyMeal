import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notificationGateway';

@Module({
  controllers: [NotificationController],
  providers: [NotificationGateway],
})
export class NotificationModule {}
