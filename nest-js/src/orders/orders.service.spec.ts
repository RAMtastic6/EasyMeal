import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { Repository } from 'typeorm';
import { Controller, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  const ORDERS_REPOSITORY_TOKEN = getRepositoryToken(Orders);
  let ordersRepo: Repository<Orders>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: ORDERS_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    ordersRepo = module.get<Repository<Orders>>(ORDERS_REPOSITORY_TOKEN);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repo should be defined', () => {
    expect(ordersRepo).toBeDefined()
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto = {} as CreateOrderDto;
      const expectedOrder = {} as Orders;
      jest.spyOn(ordersRepo, 'save').mockResolvedValue(expectedOrder);
      const result = await service.create(createOrderDto);
      expect(result).toEqual(expectedOrder);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const expectedOrders = [{},{}] as Orders[];
      jest.spyOn(ordersRepo, 'find').mockResolvedValue(expectedOrders);
      const result = await service.findAll();
      expect(result).toEqual(expectedOrders);
    });

    it('should throw NotFoundException if no orders found', async () => {
      jest.spyOn(ordersRepo, 'find').mockResolvedValue([]);
      expect(service.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      const updateOrder = {
        customer_id: 1,
        reservation_id: 1,
        food_id: 1,
        quantity: 2,
      };
      jest.spyOn(ordersRepo, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(ordersRepo, 'update').mockResolvedValue({} as any);
      await service.addQuantity(updateOrder);
      expect(ordersRepo.update).toHaveBeenCalled();
    });

    it('should throw NotFoundException if order not found', async () => {
      const updateOrder = {
        customer_id: 1,
        reservation_id: 1,
        food_id: 1,
        quantity: 2,
      };
      jest.spyOn(ordersRepo, 'findOne').mockResolvedValueOnce(null);
      expect(service.addQuantity(updateOrder)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const order = {
        customer_id: 1,
        reservation_id: 1,
        food_id: 1,
      };
      const expectedOrder = {
        customer_id: 1,
        reservation_id: 1,
        food_id: 1,
      } as Orders;
      jest.spyOn(ordersRepo, 'delete').mockResolvedValue(expectedOrder as any);
      const result = await service.remove(order);
      expect(result).toEqual(expectedOrder);
    });
  });

  describe('getPartialBill', () => {
    it('should return the partial bill for a customer and reservation', async () => {
      const order = {
        customer_id: 1,
        reservation_id: 1,
      };
      const expectedBill = 50;
      jest.spyOn(ordersRepo, 'find').mockResolvedValue([
        { quantity: 2, food: { price: 10 } },
        { quantity: 3, food: { price: 10 } },
      ] as Orders[]);
      const result = await service.getPartialBill(order);
      expect(result).toEqual(expectedBill);
    });

    it('should throw NotFoundException if order not found', async () => {
      const order = {
        customer_id: 1,
        reservation_id: 1,
      };
      jest.spyOn(ordersRepo, 'find').mockResolvedValue([]);
      expect(service.getPartialBill(order)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getTotalBill', () => {
    it('should return the total bill for a reservation', async () => {
      const order = {
        reservation_id: 1,
      };
      const expectedBill = 50;
      jest.spyOn(ordersRepo, 'find').mockResolvedValue([
        { quantity: 2, food: { price: 10 } },
        { quantity: 3, food: { price: 10 } },
      ] as Orders[]);
      const result = await service.getTotalBill(order);
      expect(result).toEqual(expectedBill);
    });

    it('should throw NotFoundException if no orders found for the reservation', async () => {
      const order = {
        reservation_id: 1,
      };
      jest.spyOn(ordersRepo, 'find').mockResolvedValue([]);
      expect(service.getTotalBill(order)).rejects.toThrow(NotFoundException);
    });
  });

  /*describe('getRomanBill', () => {
    it('should return the roman bill for a reservation', async () => {
      const order = {
        reservation_id: 1,
      };
      const expectedRomanBill = 'C';
      jest.spyOn(ordersRepo, 'find').mockResolvedValue([
        { quantity: 2, food: { price: 50 } },
        { quantity: 3, food: { price: 10 } },
      ] as Orders[]);
      const result = await service.getRomanBill(order);
      expect(result).toEqual(expectedRomanBill);
    });

    it('should throw NotFoundException if no orders found for the reservation', async () => {
      const order = {
        reservation_id: 1,
      };
      jest.spyOn(ordersRepo, 'find').mockResolvedValue([]);
      expect(service.getRomanBill(order)).rejects.toThrow(NotFoundException);
    });
  });*/
});