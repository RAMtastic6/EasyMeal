import { Test, TestingModule } from '@nestjs/testing';
import { NotificationGateway,  } from './notificationGateway';
import { NotificationDto } from './dto/notification.dto'
import { Server, Socket } from 'socket.io';
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('NotificationGateway', () => {
  let gateway: NotificationGateway;
  let server: Server;
  let socket: Socket;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationGateway],
    }).compile();

    gateway = module.get<NotificationGateway>(NotificationGateway);
    server = new Server();
    gateway.server = server;
    socket = {
      handshake: {
        auth: {
          token: 'testToken',
        },
      },
      disconnect: jest.fn(),
      join: jest.fn(),
      on: jest.fn(),
      id: 'testSocketId',
    } as unknown as Socket;
  });

  it('should emit notifications to all receivers', async () => {
    const emitSpy = jest.spyOn(server, 'to').mockReturnThis();
    const emitToSpy = jest.spyOn(server, 'emit');

    const notification: NotificationDto = {
      id_receiver: [1, 2, 3],
      title: 'Test Title',
      message: 'Test Message',
      id: 1,
    };

    await gateway.emitAll(notification);

    expect(emitSpy).toHaveBeenCalled();
    expect(emitSpy).toHaveBeenCalledWith(['1', '2', '3']);

    expect(emitToSpy).toHaveBeenCalled();
    expect(emitToSpy).toHaveBeenCalledWith('onNotification',{ 
      title: notification.title, message: notification.message, id: notification.id
    });
  });

  describe('handleConnection', () => {
    it('should disconnect if no token is provided', async () => {
      socket.handshake.auth.token = null;
      await gateway.handleConnection(socket);
      expect(socket.disconnect).toHaveBeenCalled();
    });
  
    it('should disconnect if the token is invalid', async () => {
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(null, { status: 401 })
      );
  
      await gateway.handleConnection(socket);
      expect(fetch).toHaveBeenCalledWith(expect.stringContaining('/decodeToken'), expect.any(Object));
      expect(socket.disconnect).toHaveBeenCalled();
    });
  
    it('should join the socket to a room if the token is valid', async () => {
      const responseData = { id: 1, role: 'user' };
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify(responseData), { status: 200 })
      );
  
      await gateway.handleConnection(socket);
      expect(socket.join).toHaveBeenCalledWith(responseData.id.toString());
      expect(socket.disconnect).not.toHaveBeenCalled();
    });
  
    it('should log when the socket disconnects', async () => {
      const responseData = { id: 1, role: 'user' };
      (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
        new Response(JSON.stringify(responseData), { status: 200 })
      );
  
      console.log = jest.fn();
  
      await gateway.handleConnection(socket);
      const disconnectCallback = (socket.on as jest.Mock).mock.calls[0][1];
      disconnectCallback();
      expect(console.log).toHaveBeenCalledWith(
        `${socket.id} disconnected from notifcationGateway/room: ${responseData.id}`
      );
    });
  });
});
