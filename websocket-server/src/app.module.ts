import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [GatewayModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}