import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersService } from './orders.service';
import { Order } from './entities/order.entity';
import { OrderIngredients } from './entities/order_ingredients';
import { FoodService } from '../food/food.service';
import { ReservationService } from '../reservation/reservation.service';
import { Reservation, ReservationStatus } from '../reservation/entities/reservation.entity';
import { NotificationService } from '../notification/notification.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: Repository<Order>;
  let orderIngredientsRepository: Repository<OrderIngredients>;
  let foodService: FoodService;
  let reservationService: ReservationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: ReservationService,
          useValue: {
            findOne: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
            save: jest.fn(),
          }
        },
        {
          provide: FoodService,
          useValue: {
            findOne: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(Order),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
            delete: jest.fn(),
            update: jest.fn(),
          }
        },
        {
          provide: getRepositoryToken(OrderIngredients),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          }
        },
        {
          provide: NotificationService,
          useValue: {
            sendNotification: jest.fn(),
          }
        }
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderIngredientsRepository = module.get<Repository<OrderIngredients>>(getRepositoryToken(OrderIngredients));
    foodService = module.get<FoodService>(FoodService);
    reservationService = module.get<ReservationService>(ReservationService);
  });

  describe('create', () => {
    it('should create an order and save it to the database', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockOrder = {
        reservation_id: 1,
        food_id: 1,
        user_id: 1,
        quantity: 1
      };
      const mockFood = {
        id: 1,
        ingredients: [
          { id: 1 },
          { id: 2 },
        ],
      };
      jest.spyOn(ordersRepository, 'create').mockReturnValue(mockOrder as any);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue(mockOrder as any);
      jest.spyOn(foodService, 'findOne').mockResolvedValue(mockFood as any);
      jest.spyOn(orderIngredientsRepository, 'create').mockReturnValue({} as any);
      jest.spyOn(orderIngredientsRepository, 'save').mockResolvedValue({} as any);

      // Call the create method
      const result = await ordersService.create(mockOrder);

      // Assert the result
      expect(result).toEqual(mockOrder);
      expect(ordersRepository.create).toHaveBeenCalledWith(mockOrder);
      expect(ordersRepository.save).toHaveBeenCalledWith(mockOrder);
      expect(foodService.findOne).toHaveBeenCalledWith(mockOrder.food_id);
      expect(orderIngredientsRepository.create).toHaveBeenCalledTimes(mockFood.ingredients.length);
      expect(orderIngredientsRepository.save).toHaveBeenCalledTimes(mockFood.ingredients.length);
    });
  });

  describe('remove', () => {
    it('should remove an order from the database', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockOrder = {
        reservation_id: 1,
        food_id: 1,
        user_id: 1,
      };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue({} as any);
      jest.spyOn(ordersRepository, 'remove').mockResolvedValue(undefined);

      // Call the remove method
      await ordersService.remove(mockOrder);

      // Assert the result
      expect(ordersRepository.remove).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all orders from the database', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockOrders = [{ id: 1 }, { id: 2 }];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(mockOrders as any);

      // Call the findAll method
      const result = await ordersService.findAll();

      // Assert the result
      expect(result).toEqual(mockOrders);
      expect(ordersRepository.find).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a specific order from the database', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockOrder = {
        user_id: 1,
        reservation_id: 1,
        food_id: 1,
      };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder as any);

      // Call the findOne method
      const result = await ordersService.findOne(mockOrder);

      // Assert the result
      expect(result).toEqual(mockOrder);
      expect(ordersRepository.findOne).toHaveBeenCalled();
    });
  });

  describe('addQuantity', () => {
    it('should add quantity to an existing order', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockUpdateOrder = {
        reservation_id: 1,
        food_id: 1,
        quantity: 2,
        user_id: 1,
      };
      const mockOrder = {
        reservation_id: 1,
        food_id: 1,
        quantity: 1,
        user_id: 1,
      };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder as any);
      jest.spyOn(ordersRepository, 'update').mockResolvedValue(mockOrder as any);

      // Call the addQuantity method
      const result = await ordersService.addQuantity(mockUpdateOrder);

      // Assert the result
      expect(result).toEqual(mockOrder);
      expect(ordersRepository.findOne).toHaveBeenCalled();
      expect(ordersRepository.update).toHaveBeenCalled();
    });
  });

  describe('updateIngredients', () => {
    it('should update the ingredients of an existing order', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockOrder = {
        id: 1,
        ingredients: [{ id: 1 }, { id: 2 }],
      };
      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(mockOrder as any);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue({} as any);

      // Call the updateIngredients method
      await ordersService.updateIngredients(mockOrder);

      // Assert the result
      expect(ordersRepository.findOne).toHaveBeenCalled();
      expect(ordersRepository.save).toHaveBeenCalled();
    });
  });

  describe('getPartialBill', () => {
    it('should return the partial bill for a specific customer and reservation', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockOrder = {
        customer_id: 1,
        reservation_id: 1,
      };
      const mockPartialBill = 0;
      jest.spyOn(ordersRepository, 'find').mockResolvedValue([] as any);

      // Call the getPartialBill method
      const result = await ordersService.getPartialBill(mockOrder);

      // Assert the result
      expect(result).toEqual(mockPartialBill);
    });
  });

  describe('getTotalBill', () => {
    it('should return the total bill for a specific reservation', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockOrder = {
        reservation_id: 1,
      };

      jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

      // Call the getTotalBill method
      const result = await ordersService.getTotalBill(mockOrder);

      // Assert the result
      expect(result).toEqual(0);
    });
  });

  describe('getReservationOrders', () => {
    it('should return all orders for a specific reservation', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockReservationId = 1;
      const mockOrders = [{ id: 1 }, { id: 2 }];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(mockOrders as any);

      // Call the getReservationOrders method
      const result = await ordersService.getReservationOrders(mockReservationId);

      // Assert the result
      expect(result).toEqual(mockOrders);
    });
  });

  describe('updateListOrders', () => {
    it('should update the list of orders for a specific user and reservation', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockOrder = {
        user_id: 1,
        reservation_id: 1,
        orders: [{ id: 1 }, { id: 2 }],
      };
      jest.spyOn(orderIngredientsRepository, 'save').mockResolvedValue(undefined);
      jest.spyOn(reservationService, 'findOne').mockResolvedValue(
        {
          id: 1,
          status: ReservationStatus.ACCEPTED,
        } as unknown as Reservation
      );

      // Call the updateListOrders method
      await ordersService.updateListOrders(mockOrder);

      expect(reservationService.findOne).toHaveBeenCalledWith(mockOrder.reservation_id);
    });
  });

  describe('pay', () => {
    it('should mark the order as paid if it exists', async () => {
      const user_id = 1;
      const reservation_id = 1;
      const order = new Order();
      order.user_id = user_id;
      order.reservation_id = reservation_id;
      order.paid = false;

      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(order);
      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);

      const result = await ordersService.pay(user_id, reservation_id);

      expect(ordersRepository.findOne).toHaveBeenCalledWith({
        where: {
          user_id,
          reservation_id,
        },
      });
      expect(order.paid).toBe(true);
      expect(ordersRepository.save).toHaveBeenCalledWith(order);
      expect(result).toBe(true);
    });

    it('should return null if the order does not exist', async () => {
      const user_id = 1;
      const reservation_id = 1;

      jest.spyOn(ordersRepository, 'findOne').mockResolvedValue(null);

      const result = await ordersService.pay(user_id, reservation_id);

      expect(ordersRepository.findOne).toHaveBeenCalledWith({
        where: {
          user_id,
          reservation_id,
        },
      });
      expect(result).toBeNull();
    });
  });
});