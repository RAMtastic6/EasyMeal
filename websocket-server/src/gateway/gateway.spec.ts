import { Test, TestingModule } from '@nestjs/testing';
import { MyGateway } from './gateway';
import e from 'express';
import { emit } from 'process';
import { on } from 'events';
import { Socket } from 'dgram';

describe('MyGateway', () => {
  let gateway: MyGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MyGateway],
    }).compile();

    gateway = module.get<MyGateway>(MyGateway);
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

  it.skip('should emit ingredient to room', () => {
    const onIngredient = jest.fn();
    const to = jest.fn().mockReturnThis();
    gateway.server = {
      to: to,
      emit: onIngredient,
    } as any;

    // const client_socket = {} as unknown as Socket;

    // gateway.onConfirm({
    //     key: 0,
    //     index: 0,
    //     ingredientIndex: 0,
    //     removed: false,
    //   },
    //   client_socket
    // );

  });
});
