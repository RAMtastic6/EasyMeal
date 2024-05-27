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
import { Food } from '../food/entities/food.entity';
import { StaffService } from 'src/staff/staff.service';

describe('OrdersService', () => {
  let ordersService: OrdersService;
  let ordersRepository: Repository<Order>;
  let orderIngredientsRepository: Repository<OrderIngredients>;
  let foodService: FoodService;
  let reservationService: ReservationService;
  
  // questi due sono da mockare per fare i test della funzione che invia le notifiche
  // all'admin dop che un ordine è stato confermato.
  let notificationService: NotificationService; 
  let staffService: StaffService;

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
            updateStatus: jest.fn(),
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
            create: jest.fn()
          }
        },
        {
          provide: StaffService,
          useValue: {
            getAdminByRestaurantId: jest.fn()
          }
        }
      ],
    }).compile();

    ordersService = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderIngredientsRepository = module.get<Repository<OrderIngredients>>(getRepositoryToken(OrderIngredients));
    foodService = module.get<FoodService>(FoodService);
    reservationService = module.get<ReservationService>(ReservationService);
    notificationService = module.get<NotificationService>(NotificationService);
    staffService = module.get<StaffService>(StaffService);
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
    it('should return the total cost for a customer correctly', async () => {
      const customer_id = 1;
      const reservation_id = 1;

      const food1 = new Food();
      food1.price = 10;

      const food2 = new Food();
      food2.price = 20;

      const order1 = new Order();
      order1.user_id = customer_id;
      order1.reservation_id = reservation_id;
      order1.quantity = 2;
      order1.food = food1;

      const order2 = new Order();
      order2.user_id = customer_id;
      order2.reservation_id = reservation_id;
      order2.quantity = 1;
      order2.food = food2;

      jest.spyOn(ordersRepository, 'find').mockResolvedValue([order1, order2]);

      const result = await ordersService.getPartialBill({ customer_id, reservation_id });

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: { user_id: customer_id, reservation_id },
        relations: { food: true },
      });
      expect(result).toBe(2 * 10 + 1 * 20);
    });

    it('should return 0 if the customer has no orders for the reservation', async () => {
      const customer_id = 1;
      const reservation_id = 1;

      jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

      const result = await ordersService.getPartialBill({ customer_id, reservation_id });

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: { user_id: customer_id, reservation_id },
        relations: { food: true },
      });
      expect(result).toBe(0);
    });
  });

  describe('getRomanBill', () => {
    it('should return the per person cost correctly', async () => {
      const reservation_id = 1;

      const food1 = new Food();
      food1.price = 10;

      const food2 = new Food();
      food2.price = 20;

      const order1 = new Order();
      order1.user_id = 1;
      order1.reservation_id = reservation_id;
      order1.quantity = 2;
      order1.food = food1;

      const order2 = new Order();
      order2.user_id = 2;
      order2.reservation_id = reservation_id;
      order2.quantity = 1;
      order2.food = food2;

      const order3 = new Order();
      order3.user_id = 1;
      order3.reservation_id = reservation_id;
      order3.quantity = 1;
      order3.food = food1;

      jest.spyOn(ordersRepository, 'find').mockResolvedValue([order1, order2, order3]);

      const result = await ordersService.getRomanBill({ reservation_id });

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: { reservation_id },
        relations: { food: true },
      });
      expect(result).toBe((2 * 10 + 1 * 20 + 1 * 10) / 2);
    });

    it('should return 0 if there are no orders', async () => {
      const reservation_id = 1;

      jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

      const result = await ordersService.getRomanBill({ reservation_id });

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: { reservation_id },
        relations: { food: true },
      });
      expect(result).toBe(0);
    });
  });

  describe('getReservationOrders', () => {
    it('should return all orders for a specific reservation', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockReservationId = 1;
      const mockOrders = [{ id: 1 }, { id: 2 }];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(mockOrders as any);

      // Call the getReservationOrders method
      const result =
        await ordersService.getReservationOrders(mockReservationId);

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
        orders: [
          {
            id: 2,
            name: "Spaghetti all'amatriciana",
            price: 9,
            menu_id: 1,
            path_image: '',
            type: 'apertivo',
            ingredients: [
              {
                id: 10,
                ingredient : {
                  id: 1
                },
                name: 'Sale',
                removed: false
              }
            ],
            quantity: 1,
          },
          {
            id: 3,
            name: 'Spaghetti al pomodoro',
            price: 8,
            menu_id: 1,
            path_image: '',
            type: 'apertivo',
            ingredients: [
              {
                id: 10,
                ingredient : {
                  id: 2
                },
                name: 'Sale',
                removed: false
              }
            ],
            quantity: 1,
          },
        ],
      };
      const adminMock = {
        id: 1,
        restaurant_id: 1,
      };

      // jest.spyOn(orderIngredientsRepository, 'save').mockResolvedValue(undefined);
      const date = new Date('2222-02-20T20:20:00.000Z');
      jest.spyOn(reservationService, 'findOne').mockResolvedValue(
        // {
        //   id: 1,
        //   status: ReservationStatus.ACCEPTED,
        // } as unknown as Reservation
        {
          id: 23,
          date: date,
          number_people: 2222,
          restaurant_id: 1,
          state: ReservationStatus.ACCEPTED,
          users: [],
        } as Reservation,
      );
      jest
        .spyOn(staffService, 'getAdminByRestaurantId')
        .mockResolvedValue(adminMock as any);


      // Call the updateListOrders method
      const result = await ordersService.updateListOrders(mockOrder);
      expect(reservationService.findOne).toHaveBeenCalledWith(
        mockOrder.reservation_id,
      );
      expect(reservationService.updateStatus).toHaveBeenCalledWith(
        mockOrder.reservation_id,
        ReservationStatus.TO_PAY,
      );

      expect(notificationService.create).toHaveBeenCalledWith({
        message: `L'ordine associato alla prenotazione con id: ${mockOrder.reservation_id} è in: ${ReservationStatus.TO_PAY}`,
        title: 'Ordinazione confermata',
        id_receiver: adminMock.id,
      });
      expect(result).toBe(true);
    });
  });

  describe('pay', () => {
    it('should mark the order as paid and update the reservation status if all orders are paid', async () => {
      const user_id = 1;
      const reservation_id = 1;
      const order = new Order();
      order.user_id = user_id;
      order.reservation_id = reservation_id;
      order.paid = false;

      const otherOrder = new Order();
      otherOrder.user_id = 2;
      otherOrder.reservation_id = reservation_id;
      otherOrder.paid = true;

      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);
      jest.spyOn(ordersRepository, 'find').mockResolvedValue([order, otherOrder]);

      const result = await ordersService.pay(user_id, reservation_id);

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: {
          user_id,
          reservation_id,
        },
      });
      expect(order.paid).toBe(true);
      expect(ordersRepository.save).toHaveBeenCalledWith(order);
      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: {
          reservation_id,
        },
      });
      expect(reservationService.updateStatus).toHaveBeenCalledWith(reservation_id, ReservationStatus.COMPLETED);
      expect(result).toBe(true);
    });

    it('should mark the order as paid but not update the reservation status if not all orders are paid', async () => {
      const user_id = 1;
      const reservation_id = 1;
      const order = new Order();
      order.user_id = user_id;
      order.reservation_id = reservation_id;
      order.paid = false;

      const otherOrder = new Order();
      otherOrder.user_id = 2;
      otherOrder.reservation_id = reservation_id;
      otherOrder.paid = false;

      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);
      jest.spyOn(ordersRepository, 'find').mockResolvedValueOnce([order]);
      jest.spyOn(ordersRepository, 'find').mockResolvedValueOnce([order, otherOrder]);

      const result = await ordersService.pay(user_id, reservation_id);

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: {
          user_id,
          reservation_id,
        },
      });
      expect(order.paid).toBe(true);
      expect(ordersRepository.save).toHaveBeenCalledWith(order);
      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: {
          reservation_id,
        },
      });
      expect(reservationService.updateStatus).not.toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return null if the order does not exist', async () => {
      const user_id = 1;
      const reservation_id = 1;

      jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);

      const result = await ordersService.pay(user_id, reservation_id);

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: {
          user_id,
          reservation_id,
        },
      });
      expect(result).toBeNull();
    });
  });
});