import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { User } from '../user/entities/user.entity';
import { StaffRole } from '../staff/enities/staff.entity';
import { Order } from './entities/order.entity';
import { PayDTO } from './dto/pay.dto';

describe('OrdersController', () => {
  let controller: OrdersController;
  let ordersService: OrdersService;
  let authService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            addQuantity: jest.fn(),
            updateIngredients: jest.fn(),
            remove: jest.fn(),
            getPartialBill: jest.fn(),
            getRomanBill: jest.fn(),
            updateListOrders: jest.fn(),
            getReservationOrders: jest.fn(),
            pay: jest.fn(),
            getTotalBill: jest.fn(),
          },
        },
        {
          provide: AuthenticationService,
          useValue: {
            verifyToken: jest.fn((x: any) => ({ id: 1, role: StaffRole.ADMIN })),
          },
        }
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
    ordersService = module.get<OrdersService>(OrdersService);
    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  describe('create', () => {
    it('should create an order', async () => {
      // Arrange
      const body = {
        reservation_id: 1,
        food_id: 1,
        token: 'token',
      };
      const user = { id: 1, role: StaffRole.ADMIN };
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(user);
      jest.spyOn(ordersService, 'create').mockResolvedValue(
        {} as Order
      );

      // Act
      const result = await controller.create(body);

      // Assert
      expect(authService.verifyToken).toHaveBeenCalledWith(body.token);
      expect(ordersService.create).toHaveBeenCalledWith({
        reservation_id: body.reservation_id,
        food_id: body.food_id,
        user_id: user.id,
      });
      expect(result).toEqual({});
    });

    it('should throw BadRequestException if token is invalid', async () => {
      // Arrange
      const body = {
        reservation_id: 1,
        food_id: 1,
        token: 'invalid_token',
      };
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.create(body)).rejects.toThrow(BadRequestException);
      expect(authService.verifyToken).toHaveBeenCalledWith(body.token);
    });

    it('should throw NotFoundException if order already exists', async () => {
      // Arrange
      const body = {
        reservation_id: 1,
        food_id: 1,
        token: 'token',
      };
      const user = { id: 1, role: StaffRole.ADMIN };
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(user);
      jest.spyOn(ordersService, 'create').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.create(body)).rejects.toThrow(NotFoundException);
      expect(authService.verifyToken).toHaveBeenCalledWith(body.token);
      expect(ordersService.create).toHaveBeenCalledWith({
        reservation_id: body.reservation_id,
        food_id: body.food_id,
        user_id: user.id,
      });
    });
  });

  describe('findAll', () => {
    it('should return all orders', async () => {
      // Arrange
      const orders = [{ id: 1 } as Order, { id: 2 } as Order];
      jest.spyOn(ordersService, 'findAll').mockResolvedValue(orders);

      // Act
      const result = await controller.findAll();

      // Assert
      expect(ordersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(orders);
    });

    it('should throw NotFoundException if no orders found', async () => {
      // Arrange
      jest.spyOn(ordersService, 'findAll').mockResolvedValue([]);

      // Act & Assert
      await expect(controller.findAll()).rejects.toThrow(NotFoundException);
      expect(ordersService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should find an order', async () => {
      // Arrange
      const order = { id: 1 } as Order;
      const requestBody = {
        user_id: 1,
        reservation_id: 1,
        food_id: 1,
      };
      jest.spyOn(ordersService, 'findOne').mockResolvedValue(order);

      // Act
      const result = await controller.findOne(requestBody);

      // Assert
      expect(ordersService.findOne).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(order);
    });

    it('should throw NotFoundException if order is not found', async () => {
      // Arrange
      const requestBody = {
        user_id: 1,
        reservation_id: 1,
        food_id: 1,
      };
      jest.spyOn(ordersService, 'findOne').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.findOne(requestBody)).rejects.toThrow(NotFoundException)
        .catch((e) => expect(e.message).toBe('Order not found'));
      expect(ordersService.findOne).toHaveBeenCalledWith(requestBody);
    });
  });

  describe('update', () => {
    it('should update an order', async () => {
      // Arrange
      const requestBody = {
        token: 'token',
        reservation_id: 1,
        food_id: 1,
        quantity: 2,
      };
      const order = { id: 1 } as Order;
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(
        { id: 1, role: StaffRole.STAFF });
      jest.spyOn(ordersService, 'addQuantity').mockResolvedValue(order);

      // Act
      const result = await controller.update(requestBody);

      // Assert
      expect(authService.verifyToken).toHaveBeenCalledWith(requestBody.token);
      expect(ordersService.addQuantity).toHaveBeenCalledWith({
        reservation_id: requestBody.reservation_id,
        food_id: requestBody.food_id,
        quantity: requestBody.quantity,
        user_id: 1
      });
      expect(result).toEqual(order);
    });

    it('should throw BadRequestException if token is invalid', async () => {
      // Arrange
      const requestBody = {
        token: 'invalid_token',
        reservation_id: 1,
        food_id: 1,
        quantity: 2,
      };
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.update(requestBody)).rejects.toThrow(BadRequestException)
        .catch((e) => expect(e.message).toBe('Invalid token'));
      expect(authService.verifyToken).toHaveBeenCalledWith(requestBody.token);
    });

    it('should throw NotFoundException if order is not found', async () => {
      // Arrange
      const requestBody = {
        token: 'token',
        reservation_id: 1,
        food_id: 1,
        quantity: 2,
      };
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(
        { id: 1, role: StaffRole.STAFF });
      jest.spyOn(ordersService, 'addQuantity').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.update(requestBody)).rejects.toThrow(NotFoundException);
      expect(authService.verifyToken).toHaveBeenCalledWith(requestBody.token);
      expect(ordersService.addQuantity).toHaveBeenCalledWith({
        reservation_id: requestBody.reservation_id,
        food_id: requestBody.food_id,
        quantity: requestBody.quantity,
        user_id: 1
      });
    });
  });

  describe('updateIngredients', () => {
    it('should update the ingredients of an order', async () => {
      // Arrange
      const requestBody = {
        id: 1,
        ingredients: ['ingredient1', 'ingredient2'],
      };
      const order = { id: 1 } as Order;
      jest.spyOn(ordersService, 'updateIngredients').mockResolvedValue(order);

      // Act
      const result = await controller.updateIngredients(requestBody);

      // Assert
      expect(ordersService.updateIngredients).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(order);
    });

    it('should throw NotFoundException if order is not found', async () => {
      // Arrange
      const requestBody = {
        id: 1,
        ingredients: ['ingredient1', 'ingredient2'],
      };
      jest.spyOn(ordersService, 'updateIngredients').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.updateIngredients(requestBody)).rejects.toThrow(NotFoundException)
        .catch((e) => expect(e.message).toBe('Order not found'));
      expect(ordersService.updateIngredients).toHaveBeenCalledWith(requestBody);
    });
  });

  describe('remove', () => {
    it('should remove an order', async () => {
      // Arrange
      const requestBody = {
        reservation_id: 1,
        food_id: 1,
        token: 'token',
      };
      const order = { id: 1 } as Order;
      jest.spyOn(ordersService, 'remove').mockResolvedValue(order);

      // Act
      const result = await controller.remove(requestBody);

      // Assert
      expect(ordersService.remove).toHaveBeenCalledWith({
        reservation_id: requestBody.reservation_id,
        food_id: requestBody.food_id,
        user_id: 1
      });
      expect(result).toEqual(order);
    });

    it('should throw NotFoundException if order is not found', async () => {
      // Arrange
      const requestBody = {
        reservation_id: 1,
        food_id: 1,
        token: 'token',
      };
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.remove(requestBody)).rejects.toThrow(BadRequestException);
    });
  });

  describe('partialBill', () => {
    it('should calculate the partial bill for a customer', async () => {
      // Arrange
      const requestBody = {
        customer_id: 1,
        reservation_id: 1,
      };
      const bill = 50;
      jest.spyOn(ordersService, 'getPartialBill').mockResolvedValue(bill);

      // Act
      const result = await controller.partialBill(requestBody);

      // Assert
      expect(ordersService.getPartialBill).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(bill);
    });
  });

  describe('RomanBill', () => {
    it('should calculate the full bill for a customer', async () => {
      // Arrange
      const requestBody = {
        customer_id: 1,
        reservation_id: 1,
      };
      const bill = "100";
      jest.spyOn(ordersService, 'getRomanBill').mockResolvedValue(bill);

      // Act
      const result = await controller.fullBill(requestBody);

      // Assert
      expect(ordersService.getRomanBill).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(bill);
    });
  });

  describe('updateListOrders', () => {
    it('should update the list of orders for a reservation', async () => {
      // Arrange
      const requestBody = {
        token: 'token',
        reservation_id: 1,
        orders: [{ id: 1 }, { id: 2 }],
      };

      jest.spyOn(authService, 'verifyToken').mockResolvedValue(
        { id: 1, role: StaffRole.ADMIN });
      jest.spyOn(ordersService, 'updateListOrders').mockResolvedValue(true);

      // Act
      const result = await controller.updateListOrders(requestBody);

      // Assert
      expect(authService.verifyToken).toHaveBeenCalledWith(requestBody.token);
      expect(ordersService.updateListOrders).toHaveBeenCalledWith({
        reservation_id: requestBody.reservation_id,
        orders: requestBody.orders,
        user_id: 1
      });
      expect(result).toEqual(true);
    });

    it('should throw BadRequestException if token is invalid', async () => {
      // Arrange
      const requestBody = {
        token: 'invalid_token',
        reservation_id: 1,
        orders: [{ id: 1 }, { id: 2 }],
      };
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(null);

      // Act & Assert
      await expect(controller.updateListOrders(requestBody)).rejects.toThrow(BadRequestException);
      expect(authService.verifyToken).toHaveBeenCalledWith(requestBody.token);
    });
  });

  describe('getReservationOrders', () => {
    it('should get the orders for a reservation', async () => {
      // Arrange
      const reservationId = 1;
      const orders = [{ id: 1 }, { id: 2 }] as Order[];
      jest.spyOn(ordersService, 'getReservationOrders').mockResolvedValue(orders);

      // Act
      const result = await controller.getReservationOrders(reservationId);

      // Assert
      expect(ordersService.getReservationOrders).toHaveBeenCalledWith(+reservationId);
      expect(result).toEqual(orders);
    });

    it('should throw NotFoundException if no orders found for the reservation', async () => {
      // Arrange
      const reservationId = 1;
      jest.spyOn(ordersService, 'getReservationOrders').mockResolvedValue([]);


      // Act & Assert
      await expect(controller.getReservationOrders(reservationId)).rejects.toThrow(NotFoundException)
        .catch((e) => expect(e.message).toBe('No orders found'));
    });
  });

  describe('pay', () => {
    it('should return true if the payment was successful', async () => {
      const payDTO: PayDTO = { user_id: 1, reservation_id: 1 };
      jest.spyOn(ordersService, 'pay').mockResolvedValue(true);

      const result = await controller.pay(payDTO);

      expect(ordersService.pay).toHaveBeenCalledWith(payDTO.user_id, payDTO.reservation_id);
      expect(result).toBe(true);
    });

    it('should return null if the order does not exist', async () => {
      const payDTO: PayDTO = { user_id: 1, reservation_id: 1 };
      jest.spyOn(ordersService, 'pay').mockResolvedValue(null);

      const result = await controller.pay(payDTO);

      expect(ordersService.pay).toHaveBeenCalledWith(payDTO.user_id, payDTO.reservation_id);
      expect(result).toBeNull();
    });
  });

  describe('totalBill', () => {
    it('should calculate the total bill for a reservation', async () => {
      // Arrange
      const requestBody = {
        reservation_id: 1,
      };
      const bill = 100;
      jest.spyOn(ordersService, 'getTotalBill').mockResolvedValue(bill);

      // Act
      const result = await controller.totalBill(requestBody);

      // Assert
      expect(ordersService.getTotalBill).toHaveBeenCalledWith(requestBody);
      expect(result).toEqual(bill);
    });
  });
});

