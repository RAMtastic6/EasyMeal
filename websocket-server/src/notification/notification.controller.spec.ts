import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationGateway } from './notificationGateway';
import { NotificationDto } from './dto/notification.dto';

describe('NotificationController', () => {
  let controller: NotificationController;
  let gateway: NotificationGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationGateway,
          useValue: {
            emitAll: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    gateway = module.get<NotificationGateway>(NotificationGateway);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call emitAll with the notification body', async () => {
    const notification: NotificationDto = {
      id_receiver: [1, 2, 3],
      title: 'Test Title',
      message: 'Test Message',
    };

    await controller.getNotification(notification);

    expect(gateway.emitAll).toHaveBeenCalledWith(notification);
  });
});

