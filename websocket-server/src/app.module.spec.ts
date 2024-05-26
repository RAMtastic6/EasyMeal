import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { NotificationModule } from './notification/notification.module';

describe('AppModule', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  it('should be defined', () => {
    const appModule = app.get(AppModule);
    expect(appModule).toBeDefined();
  });

  it('should have AppController', () => {
    const appController = app.get(AppController);
    expect(appController).toBeInstanceOf(AppController);
  });

  it('should have AppService', () => {
    const appService = app.get(AppService);
    expect(appService).toBeInstanceOf(AppService);
  });

  it('should import GatewayModule', () => {
    const gatewayModule = app.select(GatewayModule);
    expect(gatewayModule).toBeDefined();
  });

  it('should import NotificationModule', () => {
    const notificationModule = app.select(NotificationModule);
    expect(notificationModule).toBeDefined();
  });
});
