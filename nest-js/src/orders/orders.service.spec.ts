import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderIngredients } from './entities/order_ingredients';
import { FoodService } from '../food/food.service';
import { ReservationService } from '../reservation/reservation.service';
import { NotFoundException } from '@nestjs/common';
import { StaffService } from 'src/staff/staff.service';
import { NotificationService } from '../notification/notification.service';
import { Reservation, ReservationStatus } from '../reservation/entities/reservation.entity';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: Repository<Order>;
  let orderIngredientsRepository: Repository<OrderIngredients>;
  let foodService: FoodService;
  let reservationService: ReservationService;
  let staffService: StaffService;
  let notificationService: NotificationService;

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

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    orderIngredientsRepository = module.get<Repository<OrderIngredients>>(getRepositoryToken(OrderIngredients));
    foodService = module.get<FoodService>(FoodService);
    reservationService = module.get<ReservationService>(ReservationService);
    notificationService = module.get<NotificationService>(NotificationService);
    staffService = module.get<StaffService>(StaffService);
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
  /*
  describe('pay', () => {
    it('should mark orders as paid and update reservation status', async () => {
      const data = { user_id: 1, reservation_id: 1, reservation: { state: 'to_pay', restaurant_id: 1 } };

      const orders = [{ id: 1, paid: false, reservation: { state: 'to_pay', restaurant_id: 1 } }, { id: 2, paid: false, reservation: { state: 'to_pay', restaurant_id: 1 } }];
      const allOrders = [...orders];
      const admin = { id: 1 };
      jest.spyOn(ordersRepository, 'find').mockResolvedValueOnce(orders as any).mockResolvedValueOnce(allOrders as any);
      jest.spyOn(ordersRepository, 'save').mockImplementation(
        async (order) => order as any
      );
      jest.spyOn(reservationService, 'updateStatus').mockResolvedValue(null);
      jest.spyOn(staffService, 'getAdminByRestaurantId').mockResolvedValue(admin as any);

      const result = await service.pay(data.user_id, data.reservation_id);

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: {
          user_id: data.user_id,
          reservation_id: data.reservation_id
        },
        relations: { reservation: data.reservation }
      });
      for (const order of orders) {
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
  */
  describe('getReservationOrders', () => {
    it('should return all orders for a specific reservation', async () => {
      // Mock the necessary dependencies and setup the test data
      const mockReservationId = 1;
      const mockOrders = [{ id: 1 }, { id: 2 }];
      jest.spyOn(ordersRepository, 'find').mockResolvedValue(mockOrders as any);

      // Call the getReservationOrders method
      const result =
        await service.getReservationOrders(mockReservationId);

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
      const result = await service.updateListOrders(mockOrder);
      expect(reservationService.findOne).toHaveBeenCalledWith(
        mockOrder.reservation_id,
      );

      expect(notificationService.create).toHaveBeenCalledWith({
        message: `L'ordine associato alla prenotazione con id: ${mockOrder.reservation_id} è in: ${ReservationStatus.TO_PAY}`,
        title: 'Ordinazione confermata',
        id_receiver: adminMock.id,
      });
      expect(result).toBe(true);
    });
  });
  /*
  describe('pay', () => {
    it('should mark the order as paid and update the reservation status if all orders are paid', async () => {
      const user_id = 1;
      const reservation_id = 1;
      const order = new Order();
      order.user_id = user_id;
      order.reservation_id = reservation_id;
      order.paid = false;
      order["reservation"].restaurant_id = 1;

      const otherOrder = new Order();
      otherOrder.user_id = 2;
      otherOrder.reservation_id = reservation_id;
      otherOrder.paid = true;

      jest.spyOn(ordersRepository, 'save').mockResolvedValue(order);
      jest.spyOn(ordersRepository, 'find').mockResolvedValue([order, otherOrder]);

      const result = await service.pay(user_id, reservation_id);

      expect(ordersRepository.find).toHaveBeenCalledWith({
        where: {
          user_id,
          reservation_id,
        },
      });
      expect(order.paid).toBe(true);
      expect(ordersRepository.save).toHaveBeenCalledWith(order);
      expect(ordersRepository.find).toHaveBeenCalled();
    });
  });
  */
  describe('updateListOrders', () => {
    it('should update the ingredients of a list of orders and update reservation status', async () => {
      const data = { user_id: 1, reservation_id: 1, orders: [{ id: 1, ingredients: [{ ingredient: { id: 1 },  removed: false }] }] };
      const reservation = { id: 1, state: 'accept' };
      jest.spyOn(reservationService, 'findOne').mockResolvedValue(reservation as any);
      jest.spyOn(orderIngredientsRepository, 'save').mockResolvedValue(null);
      jest.spyOn(reservationService, 'updateStatus').mockResolvedValue(null);
      jest.spyOn(staffService, 'getAdminByRestaurantId').mockResolvedValue({ id: 1 } as any);
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
  describe('pay', () => {
  
    describe('when orders exist', () => {
      const mockUserId = 1;
      const mockReservationId = 1;
      const mockOrders = [
        { id: 1, paid: false, reservation: { state: 'to_pay', restaurant_id: 1 } },
        { id: 2, paid: false, reservation: { state: 'to_pay', restaurant_id: 1 } }
      ];
      const mockAllOrders = [
        { id: 1, paid: false, reservation: { state: 'to_pay', restaurant_id: 1 } },
        { id: 2, paid: false, reservation: { state: 'to_pay', restaurant_id: 1 } },
        { id: 3, paid: false, reservation: { state: 'to_pay', restaurant_id: 1 } }
      ]
      const mockAdmin = { id: 1 };
  
      beforeEach(() => {
        jest.spyOn(ordersRepository, 'save').mockImplementation(async (order) => order as any);
        jest.spyOn(reservationService, 'updateStatus').mockResolvedValue(null);
        jest.spyOn(staffService, 'getAdminByRestaurantId').mockResolvedValue(mockAdmin as any);
      });
  
      it('should mark orders as paid and update reservation status', async () => {
        jest.spyOn(ordersRepository, 'find').mockResolvedValue(mockOrders as any);

        // Arrange
        const expectedUpdatedOrders = mockOrders.map(order => ({ ...order, paid: true }));
        const expectedUpdatedReservationStatus = ReservationStatus.COMPLETED;
        
        // Act
        const result = await service.pay(mockUserId, mockReservationId);
        
        // Assert
        expect(ordersRepository.find).toHaveBeenCalledWith({
          where: {
            user_id: mockUserId,
            reservation_id: mockReservationId
          },
          relations: { reservation: true }
        });
        expect(ordersRepository.save).toHaveBeenCalledWith(expectedUpdatedOrders);
        expect(reservationService.updateStatus).toHaveBeenCalledWith(mockReservationId, expectedUpdatedReservationStatus);
        expect(notificationService.create).toHaveBeenCalledWith({ id_receiver: mockAdmin.id, message: `Quota pagata per tutti i partecipanti nella prenotazione con id: ${mockReservationId}`, title: 'Quota pagata' });
        expect(result).toBe(true);
      });
      
      it('should mark orders as paid and send notification for individual payment', async () => {
        jest.spyOn(ordersRepository, 'find').mockResolvedValueOnce(mockOrders as any);
        // Arrange
        const expectedUpdatedOrders = mockOrders.map(order => ({ ...order, paid: true }));
        const expectedNotificationMessage = `Quota pagata per ${mockUserId} nella prenotazione con id: ${mockReservationId}`;
        jest.spyOn(ordersRepository, 'find').mockResolvedValueOnce(mockAllOrders as any);

        // Act
        const result = await service.pay(mockUserId, mockReservationId);
        
        // Assert
        expect(ordersRepository.find).toHaveBeenCalledWith({
          where: {
            user_id: mockUserId,
            reservation_id: mockReservationId
          },
          relations: { reservation: true }
        });
        expect(ordersRepository.save).toHaveBeenCalledWith(expectedUpdatedOrders);
        expect(notificationService.create).toHaveBeenCalledWith({ id_receiver: mockAdmin.id, message: expectedNotificationMessage, title: 'Quota pagata' });
        expect(result).toBe(true);
      });
    });
  
    describe('when no orders exist', () => {

      const mockUserId = 1;
      const mockReservationId = 1;
  
      beforeEach(() => {
        jest.spyOn(ordersRepository, 'find').mockResolvedValue([]);
      });
  
      it('should return null', async () => {
        // Act
        const result = await service.pay(mockUserId, mockReservationId);
  
        // Assert
        expect(result).toBeNull();
        expect(ordersRepository.find).toHaveBeenCalledWith({
          where: {
            user_id: mockUserId,
            reservation_id: mockReservationId
          },
          relations: { reservation: true }
        });
      });
    });
  });
});