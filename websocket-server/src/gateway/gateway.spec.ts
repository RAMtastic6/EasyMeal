import { Test, TestingModule } from '@nestjs/testing';
import { MyGateway } from './gateway';
import e from 'express';
import { emit } from 'process';
import { on } from 'events';

import { Socket } from 'socket.io';
import { Server } from 'socket.io';

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
    
      const body = { id_prenotazione: 'testRoomId' };

      // Aggiungi mockSocket alla stanza
      mockSocket.rooms.add(body.id_prenotazione);

      await gateway.onConfirm(body, mockClient);

      expect(mockSocket.emit).toHaveBeenCalledWith('onConfirm');
    });

    // it('should not emit onConfirm to the same socket', async () => {
    //   const body = { id_prenotazione: 'testRoomId' };
  
    //   // Aggiungi mockClient alla stanza
    //   mockClient.rooms = new Set<string>().add(body.id_prenotazione);
  
    //   await gateway.onConfirm(body, mockClient);
  
    //   expect(mockSocket.emit).not.toHaveBeenCalled();
    // });

    it('should not emit onConfirm if socket is not in the room', async () => {
      const body = { id_prenotazione: 'testRoomId' };

      await gateway.onConfirm(body, mockClient);

      expect(mockSocket.emit).not.toHaveBeenCalled();
    });
  }); 
});
