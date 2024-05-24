import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm';
import { Reservation, ReservationStatus } from './entities/reservation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { NotFoundException, HttpException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { NotificationService } from '../notification/notification.service';
import { StaffService } from '../staff/staff.service';
import { Staff } from '../staff/enities/staff.entity';
import { UserService } from '../user/user.service';

describe('ReservationService', () => {
  let service: ReservationService;
  let restaurantService: RestaurantService;
  let reservationRepo: Repository<Reservation>;
  let notificationService: NotificationService;
  let staffService: StaffService;
  let userService: UserService;
  const reservationToken = getRepositoryToken(Reservation);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        {
          provide: RestaurantService,
          useValue: {
            findOne: jest.fn(),
            getBookedTables: jest.fn(),
          },
        },
        {
          provide: reservationToken,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            update: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: StaffService,
          useValue: {
            getAdminByRestaurantId: jest.fn(),
          },
        },
        {
          provide: UserService,
          useValue: {
            findOne: jest.fn(),
          },
        }
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    service = module.get<ReservationService>(ReservationService);
    reservationRepo = module.get<Repository<Reservation>>(reservationToken);
    notificationService = module.get<NotificationService>(NotificationService);
    staffService = module.get<StaffService>(StaffService);
    userService = module.get<UserService>(UserService);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('reservationRepo should be defined', () => {
    expect(reservationRepo).toBeDefined();
  });

  describe('create', () => {
    const restaurantId = 1;
    const date = '2025-01-01';
    const numberPeople = 4;
    const userId = 1;
  
    const createReservationDto: CreateReservationDto = {
      restaurant_id: restaurantId,
      date: date,
      number_people: numberPeople,
      token: 'token'
    };
  
    const restaurant = {
      id: restaurantId,
      name: 'Test Restaurant',
      tables: 5,
    } as Restaurant;
  
    const reservation = {
      id: 1,
      restaurant: restaurant,
      date: date,
      numberPeople: numberPeople,
      user: {
        id: userId,
        name: 'Test User',
      },
    } as unknown as Reservation;
  
    beforeEach(async () => {
      jest.spyOn(reservationRepo, 'create').mockReturnValueOnce(reservation);
      jest.spyOn(reservationRepo, 'save').mockResolvedValueOnce(reservation);
      jest.spyOn(staffService, 'getAdminByRestaurantId').mockResolvedValueOnce(
        {user_id: 1} as Staff
      );
      jest.spyOn(userService, 'findOne').mockResolvedValueOnce({ id: userId } as any);
      jest.spyOn(notificationService, 'create').mockResolvedValueOnce(undefined);
    });
  
    it('should create a reservation', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValueOnce(restaurant);
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValueOnce(3);
      const result = await service.create(restaurantId, date, numberPeople, userId);
  
      expect(restaurantService.findOne).toHaveBeenCalledWith(restaurantId);
      expect(restaurantService.getBookedTables).toHaveBeenCalledWith(restaurantId, date);
      expect(result).toEqual({
        status: true,
        id: reservation.id,
        data: reservation
      });
    });
  
    it('should return null if restaurant is not found', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValueOnce(null);
  
      const result = await service.create(restaurantId, date, numberPeople, userId);
  
      expect(result).toBe(null);
    });
  
    it('should return { status: false, message: "Restaurant is full" } if restaurant is fully booked', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValueOnce(restaurant);
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValueOnce(5);
  
      const result = await service.create(restaurantId, date, numberPeople, userId);
  
      expect(result).toEqual({ status: false, message: 'Restaurant is full' });
    });
  
    it('should return null if date is in the past', async () => {
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValueOnce(3);
      jest.spyOn(restaurantService, 'findOne').mockResolvedValueOnce(restaurant);
      jest.spyOn(Date, 'now').mockReturnValueOnce(new Date('2026-01-02').getTime());
      const result = await service.create(restaurantId, date, numberPeople, userId);
  
      expect(result).toBe(null);
    });
  });

  describe('addCustomer', () => {
    const params = {
      user_id: 1,
      reservation_id: 1,
    };

    const reservation = {
      id: 1,
      users: [],
    } as Reservation;

    it('should add a customer to a reservation', async () => {
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(reservation);
      jest.spyOn(reservationRepo, 'update').mockResolvedValueOnce(undefined);

      const result = await service.addCustomer(params);

      expect(reservationRepo.findOne).toHaveBeenCalled();
      expect(reservationRepo.update).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should return null if reservation is not found', async () => {
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);

      expect(await service.addCustomer(params)).toBe(null);
      expect(reservationRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const reservations = [{ id: 1 }, { id: 2 }] as Reservation[];

      jest.spyOn(reservationRepo, 'find').mockResolvedValue(reservations);

      const result = await service.findAll();

      expect(reservationRepo.find).toHaveBeenCalled();
      expect(result).toEqual(reservations);
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const reservation = { id: 1 } as Reservation;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(reservation);

      const result = await service.findOne(1);

      expect(reservationRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(reservation);
    });
  });

  describe('getMenuWithOrdersQuantityByIdReservation', () => {
    it('should return orders with quantity for a reservation', async () => {
      const id = 1;
      const result = {
        id: 1,
        restaurant: {
          id: 1,
          address: '123 Main St',
          city: 'New York',
          cuisine: 'Italian',
          name: 'Pizza Place',
          menu: {
            id: 1,
            foods: [
              { id: 1, name: 'Pizza', price: 10, quantity: 2 },
              { id: 2, name: 'Pasta', price: 8, quantity: 1 },
            ],
          },
        },
        orders: [{
          food: { id: 1, name: 'Pizza' },
          quantity: 2,
        }]
      } as unknown as Reservation;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(result);

      const response = await service.getMenuWithOrdersQuantityByIdReservation(id);

      expect(response).toEqual(result);
    });

    it('should return null if reservation is not found', async () => {
      const id = 1;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);

      expect(await service.getMenuWithOrdersQuantityByIdReservation(id)).toBe(null);
    });
  });

  describe('getReservationsByRestaurantId', () => {
    it('should return reservations by restaurant id', async () => {
      const restaurantId = 1;
      const reservations = [{ id: 1 }, { id: 2 }] as Reservation[];

      jest.spyOn(reservationRepo, 'find').mockResolvedValue(reservations);

      const result = await service.getReservationsByRestaurantId(restaurantId);

      expect(reservationRepo.find).toHaveBeenCalledWith({ where: { restaurant_id: restaurantId } });
      expect(result).toEqual(reservations);
    });
  });

  describe('acceptReservation', () => {
    it('should accept a reservation', async () => {
      const id = 1;
      const reservation = { id: 1, state: 'PENDING' } as unknown as Reservation;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(reservation);
      jest.spyOn(reservationRepo, 'update').mockResolvedValueOnce(undefined);

      const result = await service.acceptReservation(id);

      expect(reservationRepo.findOne).toHaveBeenCalledWith({ where: { id, state: 'pending' } });
      expect(reservationRepo.update).toHaveBeenCalledWith({ id }, { state: 'accept' });
      expect(result).toEqual(undefined);
    });

    it('should return null if reservation is not found', async () => {
      const id = 1;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);

      const result = await service.acceptReservation(id);

      expect(result).toEqual(null);
    });
  });

  describe('rejectReservation', () => {

    it('should reject a reservation', async () => {
      const id = 1;
      const reservation = { id: 1, state: 'PENDING' } as unknown as Reservation;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(reservation);
      jest.spyOn(reservationRepo, 'update').mockResolvedValueOnce(undefined);

      const result = await service.rejectReservation(id);

      expect(reservationRepo.findOne).toHaveBeenCalled();
      expect(reservationRepo.update).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should return null if reservation is not found', async () => {
      const id = 1;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);

      const result = await service.rejectReservation(id);

      expect(result).toEqual(null);
    });
  });

  describe('updateStatus', () => {
    it('should update the status of a reservation', async () => {
      const id = 1;
      const state = ReservationStatus.ACCEPTED;
      const userId = 1;
      const reservation = { id: 1, users: [] } as Reservation;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(reservation);
      jest.spyOn(reservationRepo, 'update').mockResolvedValueOnce(undefined);

      const result = await service.updateStatus(id, state, userId);

      expect(reservationRepo.findOne).toHaveBeenCalled();
      expect(reservationRepo.update).toHaveBeenCalled();
      expect(result).toEqual(true);
    });

    it('should return false if reservation is not found', async () => {
      const id = 1;
      const state = ReservationStatus.ACCEPTED;
      const userId = 1;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);

      const result = await service.updateStatus(id, state, userId);

      expect(result).toEqual(false);
    });
  });

  describe('getReservationsByUserId',() => {
    it('should return reservations by user Id', async () => {
      jest.spyOn(reservationRepo, 'find').mockResolvedValue([])
      expect(await service.getReservationsByUserId(1)).toEqual([])
    });
  }); 

  describe('verifyReservation', () => {
    const reservationId = 1;
    const userId = 1;
    const reservation = { id: reservationId, users: [{ id: userId }] } as Reservation;
  
    it('should return the reservation if it exists and the user is associated with it', async () => {
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(reservation);
  
      const result = await service.verifyReservation(reservationId, userId);
  
      expect(reservationRepo.findOne).toHaveBeenCalled();
      expect(result).toEqual(reservation);
    });
  
    it('should return null if the reservation does not exist', async () => {
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(null);
  
      const result = await service.verifyReservation(reservationId, userId);
  
      expect(result).toBe(null);
    });
  });

});