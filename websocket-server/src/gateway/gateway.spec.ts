import { Test, TestingModule } from '@nestjs/testing';
import { MyGateway } from './gateway';
import e from 'express';
import { emit } from 'process';

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
    gateway.server = {
      to: jest.fn().mockReturnThis(),
      emit: onMessage,
    } as any;
    gateway.onIncrement({ id_prenotazione: '123', data: { index: 0, quantity: 1 } });
    expect(onMessage).toHaveBeenCalledWith('onMessage', { index: 0, quantity: 1 });
  });
});