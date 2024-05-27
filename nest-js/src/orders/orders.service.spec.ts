import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderIngredients } from './entities/order_ingredients';
import { FoodService } from '../food/food.service';
import { ReservationService } from '../reservation/reservation.service';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Repository<Order>;
  let orderIngredientsRepository: Repository<OrderIngredients>;
  let foodService: FoodService;
  let reservationService: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(OrderIngredients),
          useClass: Repository,
        },
        {
          provide: FoodService,
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: ReservationService,
          useValue: {
            updateStatus: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderIngredientsRepository = module.get<Repository<OrderIngredients>>(getRepositoryToken(OrderIngredients));
    foodService = module.get<FoodService>(FoodService);
    reservationService = module.get<ReservationService>(ReservationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new order and save ingredients', async () => {
      const data = { reservation_id: 1, food_id: 1, user_id: 1 };
      const food = { id: 1, ingredients: [{ id: 1 }, { id: 2 }] };
      const order = { id: 1, ...data, quantity: 1 };
      jest.spyOn(ordersRepository, 'create').mockReturnValue(order as any);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order as any);
      jest.spyOn(foodService, 'findOne').mockResolvedValue(food as any);
      jest.spyOn(orderIngredientsRepository, 'create').mockImplementation((ingredient) => ingredient as any);
      jest.spyOn(orderIngredientsRepository, 'save').mockResolvedValue(null);

      const result = await service.create(data);

      expect(result).toEqual(order);
      expect(ordersRepository.create).toHaveBeenCalledWith({
        reservation_id: data.reservation_id,
        food_id: data.food_id,
        user_id: data.user_id,
        quantity: 1,
      });
      expect(ordersRepository.save).toHaveBeenCalledWith(order);
      expect(foodService.findOne).toHaveBeenCalledWith(data.food_id);
      food.ingredients.forEach((ingredient) => {
        expect(orderIngredientsRepository.create).toHaveBeenCalledWith({
          order_id: order.id,
          ingredient_id: ingredient.id,
          removed: false,
        });
        expect(orderIngredientsRepository.save).toHaveBeenCalledWith({
          order_id: order.id,
          ingredient_id: ingredient.id,
          removed: false,
        });
      });
    });
  });

  describe('remove', () => {
    it('should remove an existing order', async () => {
      const data = { reservation_id: 1, food_id: 1, user_id: 1 };
      const order = { id: 1, ...data, quantity: 1 };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order as any);
      jest.spyOn(ordersRepository, 'remove').mockResolvedValue(order as any);

      const result = await service.remove(data);

      expect(result).toEqual(order);
      expect(ordersRepository.findOne).toHaveBeenCalledWith({ where: data });
      expect(ordersRepository.remove).toHaveBeenCalledWith(order);
    });

    it('should return null if order does not exist', async () => {
      const data = { reservation_id: 1, food_id: 1, user_id: 1 };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      const result = await service.remove(data);

      expect(result).toBeNull();
      expect(ordersRepository.findOne).toHaveBeenCalledWith({ where: data });
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      const orders = [{ id: 1 }, { id: 2 }];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders as any);

      const result = await service.findAll();

      expect(result).toEqual(orders);
      expect(ordersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return an order by criteria', async () => {
      const data = { user_id: 1, reservation_id: 1, food_id: 1 };
      const order = { id: 1, ...data, quantity: 1 };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order as any);

      const result = await service.findOne(data);

      expect(result).toEqual(order);
      expect(ordersRepository.findOne).toHaveBeenCalledWith({ where: data });
    });

    it('should return null if order does not exist', async () => {
      const data = { user_id: 1, reservation_id: 1, food_id: 1 };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      const result = await service.findOne(data);

      expect(result).toBeNull();
      expect(ordersRepository.findOne).toHaveBeenCalledWith({ where: data });
    });
  });

  describe('addQuantity', () => {
    it('should update the quantity of an existing order', async () => {
      const data = { user_id: 1, reservation_id: 1, food_id: 1, quantity: 2 };
      const order = { id: 1, ...data, quantity: 1 };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order as any);
      jest.spyOn(ordersRepository, 'update').mockResolvedValue(null);

      const result = await service.addQuantity(data);

      expect(result).toEqual(order);
      expect(ordersRepository.findOne).toHaveBeenCalledWith({ where: { user_id: data.user_id, reservation_id: data.reservation_id, food_id: data.food_id } });
      expect(ordersRepository.update).toHaveBeenCalledWith(
        { user_id: data.user_id, reservation_id: data.reservation_id, food_id: data.food_id },
        { quantity: order.quantity + data.quantity },
      );
    });

    it('should return null if order does not exist', async () => {
      const data = { user_id: 1, reservation_id: 1, food_id: 1, quantity: 2 };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      const result = await service.addQuantity(data);

      expect(result).toBeNull();
      expect(ordersRepository.findOne).toHaveBeenCalledWith({ where: { user_id: data.user_id, reservation_id: data.reservation_id, food_id: data.food_id } });
    });
  });

  describe('updateIngredients', () => {
    it('should update the ingredients of an existing order', async () => {
      const data = { id: 1, ingredients: [{ id: 1, removed: false }] };
      const order = { id: 1, ingredients: [] };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order as any);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order as any);

      const result = await service.updateIngredients(data);

      expect(result).toEqual(order);
      expect(ordersRepository.findOne).toHaveBeenCalledWith({ where: { id: data.id }, relations: { ingredients: true } });
      expect(ordersRepository.save).toHaveBeenCalledWith(order);
    });

    it('should return null if order does not exist', async () => {
      const data = { id: 1, ingredients: [{ id: 1, removed: false }] };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      const result = await service.updateIngredients(data);

      expect(result).toBeNull();
      expect(ordersRepository.findOne).toHaveBeenCalledWith({ where: { id: data.id }, relations: { ingredients: true } });
    });
  });

  describe('getPartialBill', () => {
    it('should return the partial bill for a customer', async () => {
      const data = { customer_id: 1, reservation_id: 1 };
      const orders = [{ id: 1, quantity: 2, food: { price: 10 } }, { id: 2, quantity: 1, food: { price: 20 } }];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders as any);

      const result = await service.getPartialBill(data);

      expect(result).toEqual(40); // (2 * 10) + (1 * 20)
      expect(ordersRepository.find).toHaveBeenCalledWith({ where: { user_id: data.customer_id, reservation_id: data.reservation_id }, relations: { food: true } });
    });
  });

  describe('getRomanBill', () => {
    it('should return the Roman bill per person', async () => {
      const data = { reservation_id: 1 };
      const orders = [
        { id: 1, user_id: 1, quantity: 2, food: { price: 10 } },
        { id: 2, user_id: 2, quantity: 1, food: { price: 20 } },
      ];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders as any);

      const result = await service.getRomanBill(data);

      expect(result).toEqual(((2 * 10 + 1 * 20) / 2).toFixed(2)); // (2 * 10 + 1 * 20) / 2
      expect(ordersRepository.find).toHaveBeenCalledWith({ where: { reservation_id: data.reservation_id }, relations: { food: true } });
    });

    it('should return 0 if no orders found', async () => {
      const data = { reservation_id: 1 };
      jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

      const result = await service.getRomanBill(data);

      expect(result).toEqual(0);
      expect(ordersRepository.find).toHaveBeenCalledWith({ where: { reservation_id: data.reservation_id }, relations: { food: true } });
    });
  });

  describe('pay', () => {
    it('should mark orders as paid and update reservation status', async () => {
      const data = { user_id: 1, reservation_id: 1 };
      const orders = [{ id: 1, paid: false }, { id: 2, paid: false }];
      const allOrders = [...orders];
      jest.spyOn(ordersRepository, 'find').mockResolvedValueOnce(orders as any).mockResolvedValueOnce(allOrders as any);
      jest.spyOn(ordersRepository, 'save').mockImplementation(
        async (order) => order as any
      );
      jest.spyOn(reservationService, 'updateStatus').mockResolvedValue(null);

      const result = await service.pay(data.user_id, data.reservation_id);

      expect(result).toBe(true);
      expect(ordersRepository.find).toHaveBeenCalledWith({ where: { user_id: data.user_id, reservation_id: data.reservation_id } });
      expect(ordersRepository.find).toHaveBeenCalledWith({ where: { reservation_id: data.reservation_id } });
      for(const order of orders) {
        order.paid = true;
      }
      expect(ordersRepository.save).toHaveBeenCalledWith(orders);
      expect(result).toBe(true);
    });

    it('should return null if no orders found', async () => {
      const data = { user_id: 1, reservation_id: 1 };
      jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

      const result = await service.pay(data.user_id, data.reservation_id);

      expect(result).toBeNull();
      expect(ordersRepository.find).toHaveBeenCalledWith({ where: { user_id: data.user_id, reservation_id: data.reservation_id } });
    });
  });

  describe('getReservationOrders', () => {
    it('should return orders for a reservation', async () => {
      const data = { reservation_id: 1 };
      const orders = [
        {
          id: 1,
          food: { name: 'Pizza', type: 'Main', price: 10 },
          ingredients: [{ ingredient: { name: 'Cheese', id: 1 }, removed: false }],
        },
      ];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(orders as any);

      const result = await service.getReservationOrders(data.reservation_id);

      expect(result).toEqual(orders);
      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: { reservation_id: data.reservation_id },
        relations: { food: true, ingredients: { ingredient: true }, reservation: true },
        select: {
          food: { name: true, type: true, price: true },
          ingredients: { ingredient: { name: true, id: true }, removed: true },
        },
      });
    });
  });

  describe('updateListOrders', () => {
    it('should update the ingredients of a list of orders and update reservation status', async () => {
      const data = { user_id: 1, reservation_id: 1, orders: [{ id: 1, ingredients: [{ ingredient: { id: 1 }, removed: false }] }] };
      const reservation = { id: 1, state: 'accept' };
      jest.spyOn(reservationService, 'findOne').mockResolvedValue(reservation as any);
      jest.spyOn(orderIngredientsRepository, 'save').mockResolvedValue(null);
      jest.spyOn(reservationService, 'updateStatus').mockResolvedValue(null);

      const result = await service.updateListOrders(data);

      expect(result).toBe(true);
      expect(reservationService.findOne).toHaveBeenCalledWith(data.reservation_id);
      data.orders.forEach((orderItem) => {
        orderItem.ingredients.forEach((ingredient) => {
          expect(orderIngredientsRepository.save).toHaveBeenCalledWith({
            order_id: orderItem.id,
            ingredient_id: ingredient.ingredient.id,
            removed: ingredient.removed,
          });
        });
      });
      expect(reservationService.updateStatus).toHaveBeenCalledWith(data.reservation_id, 'to_pay');
    });

    it('should return null if reservation is not found or not accepted', async () => {
      const data = { user_id: 1, reservation_id: 1, orders: [{ id: 1, ingredients: [{ ingredient: { id: 1 }, removed: false }] }] };
      jest.spyOn(reservationService, 'findOne').mockResolvedValue(null);

      const result = await service.updateListOrders(data);

      expect(result).toBeNull();
    });
  });
  describe('getTotalBill', () => {
    it('should return the total bill for a specific reservation', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockReservationId = 1;
      const mockOrders = [
        { id: 1, quantity: 2, food: { price: 10 } },
        { id: 2, quantity: 1, food: { price: 20 } },
      ];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(mockOrders as any);

      // Call the getTotalBill method
      const result = await service.getTotalBill({ reservation_id: mockReservationId });

      // Calculate the expected total bill
      const expectedTotalBill = mockOrders.reduce((acc, order) => acc + (order.quantity * order.food.price), 0);

      // Assert the result
      expect(result).toEqual(expectedTotalBill);
    });

    it('should return 0 if there are no orders for the reservation', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockReservationId = 1;
      jest.spyOn(ordersRepository, 'find').mockResolvedValue([] as any);

      // Call the getTotalBill method
      const result = await service.getTotalBill({ reservation_id: mockReservationId });

      // Assert the result
      expect(result).toEqual(0);
    });
  });
});
