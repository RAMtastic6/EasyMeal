import { Test, TestingModule } from '@nestjs/testing';
import { MyGateway } from './gateway';

import { Socket } from 'socket.io';
import { Server } from 'socket.io';
import { emit } from 'process';

describe('MyGateway', () => {
  let gateway: MyGateway;
  let mockServer: Server;
  let mockSocket: jest.Mocked<Socket>;
  let mockClient: jest.Mocked<Socket>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyGateway],
    }).compile();

    gateway = module.get<MyGateway>(MyGateway);

    // Mock Server e Sockets
    mockServer = {
      sockets: {
        sockets: new Map<string, jest.Mocked<Socket>>(),
      },
    } as unknown as Server;

    gateway.server = mockServer;

    mockSocket = {
      id: 'mockSocketId',
      rooms: new Set<string>(),
      emit: jest.fn(),
    } as unknown as jest.Mocked<Socket>;

    mockClient = {
      id: 'mockClientId',
      rooms: new Set<string>().add('testroomid'),
      emit: jest.fn(),
    } as unknown as jest.Mocked<Socket>;

    // Aggiungi mockSocket alla lista di sockets
    mockServer.sockets.sockets.set(mockSocket.id, mockSocket);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });


  it('should emit message to room', () => {
    const onMessage = jest.fn();
    const to = jest.fn().mockReturnThis();
    gateway.server = {
      to: to,
      emit: onMessage,
    } as any;

    // chiama la funzione
    gateway.onIncrement({
      id_prenotazione: '123',
      data: { index: 0, quantity: 1 },
    });

    // verifica che il metodo to sia stato chiamato con il parametro '123'
    expect(to).toHaveBeenCalledWith('123');

    // verifica che la funzione emit del server sia stata chiamata
    // con i parametri onMessage e data
    expect(onMessage).toHaveBeenCalledWith('onMessage', {
      index: 0,
      quantity: 1,
    });
  });

  it('should emit ingredient to room', () => {
    const onIngredient = jest.fn();
    const to = jest.fn().mockReturnThis();
    gateway.server = {
      to: to,
      emit: onIngredient,
    } as any;
    gateway.onIngredient({
      id_prenotazione: '123',
      data: {
        key: 0,
        index: 0,
        ingredientIndex: 0,
        removed: false,
      },
    });

    // verifica che il metodo to sia stato chiamato con il parametro '123'
    expect(to).toHaveBeenCalledWith('123');

    // verifica che la funzione emit del server sia stata chiamata
    // con i parametri onIngredient e data
    expect(onIngredient).toHaveBeenCalledWith('onIngredient', {
      key: 0,
      index: 0,
      ingredientIndex: 0,
      removed: false,
    });
  });

  describe('onConfirm', () => {

    it('should emit onConfirm to other sockets in the same room', async () => {
      const onMessage = jest.fn().mockReturnThis();
      const to = jest.fn(() => ({
        except: jest.fn(() => ({
          emit: onMessage,
        })),
      }));
      gateway.server = {
        to: to,
      } as any;

      // Configura la stanza e il socket corrente
      const roomId = 'testRoomId';
      mockClient.rooms.add(roomId);
      mockSocket.rooms.add(roomId);

      // Esegui la funzione onConfirm con il body e il client mock corrente
      await gateway.onConfirm({ id_prenotazione: roomId }, mockSocket);

      // Verifica che l'evento 'onConfirm' sia stato emesso agli altri client nella stanza
      expect(to).toHaveBeenCalled();
    });

    it('should not emit onConfirm to the same socket', async () => {
      const body = { id_prenotazione: 'testroomid' };
      const onMessage = jest.fn().mockReturnThis();
      const to = jest.fn(() => ({
        except: jest.fn().mockReturnThis(),
        emit: onMessage,
      }));
      gateway.server = {
        to: to,
      } as any;

      // Aggiungi mockClient alla stanza
      // mockClient.rooms = new Set<string>().add(body.id_prenotazione);
  
      await gateway.onConfirm(body, mockClient);
  
      expect(mockSocket.emit).not.toHaveBeenCalled();
    });

    it('should not emit onConfirm if socket is not in the room', async () => {
      const body = { id_prenotazione: 'testRoomId' };
      const onMessage = jest.fn().mockReturnThis();
      const to = jest.fn(() => ({
        except: jest.fn().mockReturnThis(),
        emit: onMessage,
      }));
      gateway.server = {
        to: to,
      } as any;

      await gateway.onConfirm(body, mockClient);

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  }); 
});
