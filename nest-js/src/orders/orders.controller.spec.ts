import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { OrderDto } from './dto/create-order.dto';
import { Orders } from './entities/order.entity';
import { UpdateOrderDto } from './dto/update-order.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let service: OrdersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [{
        provide: OrdersService,
        useValue: {
          create: jest.fn(),
          findAll: jest.fn(),
          findOne: jest.fn(),
          update: jest.fn(),
          remove: jest.fn(),
          getPartialBill: jest.fn(),
          getTotalBill: jest.fn(),
          getReservationOrders: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an order', async () => {
      const createOrderDto: OrderDto = {} as OrderDto;
      jest.spyOn(service, 'create').mockResolvedValueOnce({} as any);
      expect(await controller.create(createOrderDto)).toEqual({});
      expect(service.create).toHaveBeenCalledWith(createOrderDto);
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(orders);
      expect(await controller.findAll()).toEqual(orders);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find an order', async () => {
      const order = {
        user_id: 1,
        reservation_id: 1,
        food_id: 1,
      } as Orders;
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(order);
      expect(await controller.findOne(order)).toEqual(order);
      expect(service.findOne).toHaveBeenCalledWith(order);
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
      jest.spyOn(service, 'update').mockResolvedValueOnce(updateOrder as any);
      expect(await controller.update(updateOrder)).toEqual(updateOrder);
      expect(service.addQuantity).toHaveBeenCalledWith(updateOrder);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      const order = {
        customer_id: 1,
        reservation_id: 1,
        food_id: 1,
      };
      jest.spyOn(service, 'remove').mockResolvedValueOnce(order as any);
      expect(await controller.remove(order)).toEqual(order);
      expect(service.remove).toHaveBeenCalledWith(order);
    });
  });

  describe('partialBill', () => {
    it('should calculate the partial bill for an order', async () => {
      const order = {
        customer_id: 1,
        reservation_id: 1,
      };

      jest.spyOn(service, 'getPartialBill').mockResolvedValueOnce(10);

      expect(await controller.partialBill(order)).toEqual(10);
      expect(service.getPartialBill).toHaveBeenCalledWith(order);
    });
  });

  describe('fullBill', () => {
    it('should calculate the total bill for an order', async () => {
      const order = {
        customer_id: 1,
        reservation_id: 1,
      };
      jest.spyOn(service, 'getTotalBill').mockResolvedValueOnce(20);
      expect(await controller.fullBill(order)).toEqual(20);
      expect(service.getTotalBill).toHaveBeenCalledWith(order);
    });
  });

  describe('getReservationOrders', () => {
    it('should get orders for a reservation', async () => {
      const id = '1';
      const orders = [
        {
          user_id: 1,
          reservation_id: 1,
          food_id: 1,
          quantity: 1,
        },
      ] as Orders[];
      jest.spyOn(service, 'getReservationOrders').mockResolvedValueOnce(orders);
      expect(await controller.getReservationOrders(id)).toEqual(orders);
      expect(service.getReservationOrders).toHaveBeenCalledWith(+id);
    });
  });
});