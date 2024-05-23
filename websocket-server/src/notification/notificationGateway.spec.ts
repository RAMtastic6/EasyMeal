import { Test, TestingModule } from '@nestjs/testing';
import { NotificationGateway,  } from './notificationGateway';
import { NotificationDto } from './dto/notification.dto'
import { Server } from 'socket.io';

describe('NotificationGateway', () => {
  let gateway: NotificationGateway;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationGateway],
    }).compile();

    gateway = module.get<NotificationGateway>(NotificationGateway);
    server = new Server();
    gateway.server = server;
  });

  it('should emit notifications to all receivers', async () => {
    const emitSpy = jest.spyOn(server, 'to').mockReturnThis();
    const emitToSpy = jest.spyOn(server, 'emit');

    const notification: NotificationDto = {
      id_receiver: [1, 2, 3],
      title: 'Test Title',
      message: 'Test Message',
    };

    await gateway.emitAll(notification);

    expect(emitSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(['1', '2', '3']);

    expect(emitToSpy).toHaveBeenCalled();
    expect(emitToSpy).toHaveBeenCalledWith('onNotification', JSON.stringify({ title: notification.title, message: notification.message }));
  });
});
