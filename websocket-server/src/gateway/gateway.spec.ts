import { Test, TestingModule } from '@nestjs/testing';
import { MyGateway } from './gateway';
import { Server, Socket } from 'socket.io';

describe('MyGateway', () => {
  let gateway: MyGateway;
  let mockServer: Server;
  let mockSocket: Socket;
  let broadcastEmitMock: jest.Mock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyGateway],
    }).compile();

    gateway = module.get<MyGateway>(MyGateway);
    broadcastEmitMock = jest.fn();

    // Mock Server and Socket
    mockServer = {
      sockets: {
        sockets: new Map(),
      },
      to: jest.fn(() => mockServer),
      except: jest.fn(() => mockServer),
      emit: jest.fn(),
      on: jest.fn(() => mockSocket),
    } as unknown as Server;

    gateway.server = mockServer;

    mockSocket = {
      id: 'mockSocketId',
      broadcast: {
        to: jest.fn(() => ({
          emit: broadcastEmitMock,
        })),
      },
      handshake: {
        query: {
          id_prenotazione: 'testRoomId',
        },
        auth: {
          token: 'testToken',
        }
      },
      join: jest.fn(),
      disconnect: jest.fn(),
      on: jest.fn(),
      rooms: new Set(['testRoomId']),
      emit: jest.fn(),
    } as unknown as Socket;

    mockServer.sockets.sockets.set('mockSocketId', mockSocket);
    mockServer.sockets.sockets.set('anotherSocketId', {
      id: 'anotherSocketId',
      rooms: new Set(['testRoomId']),
      emit: jest.fn(),
    } as unknown as Socket);
  });

  describe('handleConnection', () => {
    it('should disconnect the socket if id_prenotazione is missing', async () => {
      // Remove id_prenotazione from mock socket
      delete mockSocket.handshake.query.id_prenotazione;
  
      // Call handleConnection
      await gateway.handleConnection(mockSocket);
  
      // Verify socket was disconnected
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  
    it('should disconnect the socket if token is missing', async () => {
      // Remove token from mock socket
      delete mockSocket.handshake.auth.token;
  
      // Call handleConnection
      await gateway.handleConnection(mockSocket);
  
      // Verify socket was disconnected
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  
    it('should disconnect the socket if token is invalid', async () => {
      // Mock fetch response
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({ status: 401 } as Response);
  
      // Call handleConnection
      await gateway.handleConnection(mockSocket);
  
      // Verify socket was disconnected
      expect(mockSocket.disconnect).toHaveBeenCalled();
    });
  
    it('should join the socket to the room if id_prenotazione is provided and token is valid', async () => {
      // Mock fetch response
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({ status: 200 } as Response);
  
      // Call handleConnection
      await gateway.handleConnection(mockSocket);
  
      // Verify socket joined the room
      expect(mockSocket.join).toHaveBeenCalledWith('testRoomId');
    });
  });

  it('should emit "onMessage" to the specified room', () => {
    const body = {
      id_prenotazione: 'testRoomId',
      data: { index: 0, quantity: 1 },
    };

    gateway.onIncrement(body);

    expect(mockServer.to).toHaveBeenCalledWith('testRoomId');
    expect(mockServer.emit).toHaveBeenCalledWith('onMessage', body.data);
  });

  it('should emit "onIngredient" to the specified room', () => {
    const body = {
      id_prenotazione: 'testRoomId',
      data: { key: 0, index: 0, ingredientIndex: 0, removed: false },
    };

    gateway.onIngredient(body);

    expect(mockServer.to).toHaveBeenCalledWith('testRoomId');
    expect(mockServer.emit).toHaveBeenCalledWith('onIngredient', body.data);
  });

  describe('onConfirm', () => {
    it('should emit "onConfirm" to all sockets in the specified room except the sender', async () => {
      const body = { id_prenotazione: 'testRoomId' };
      const newSocket = {

      }

      await gateway.onConfirm(body, mockSocket);

      expect(mockSocket.broadcast.to).toHaveBeenCalledWith('testRoomId');
      expect(broadcastEmitMock).toHaveBeenCalledWith('onConfirm');
    });
  });
});