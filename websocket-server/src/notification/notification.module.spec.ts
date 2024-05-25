import { Test, TestingModule } from '@nestjs/testing';
import { NotificationModule } from './notification.module';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notificationGateway';

describe('NotificationModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [NotificationModule],
    }).compile();
  });

  it('should be defined', () => {
    const notificationModule = module.get(NotificationModule);
    expect(notificationModule).toBeDefined();
  });

  it('should have NotificationController', () => {
    const notificationController = module.get(NotificationController);
    expect(notificationController).toBeInstanceOf(NotificationController);
  });

  it('should have NotificationGateway', () => {
    const notificationGateway = module.get(NotificationGateway);
    expect(notificationGateway).toBeInstanceOf(NotificationGateway);
  });
});
