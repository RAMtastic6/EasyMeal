import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RestaurantService } from '../restaurant/restaurant.service';
import { NotFoundException, HttpException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

describe('ReservationService', () => {
  let service: ReservationService;
  let restaurantService: RestaurantService;
  let reservationRepo: Repository<Reservation>;
  let restaurantRepo: Repository<Restaurant>;
  const reservationToken = getRepositoryToken(Reservation);
  const restaurantToken = getRepositoryToken(Restaurant);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationService,
        RestaurantService,
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
          provide: restaurantToken,
          useValue: {
            findOne: jest.fn(),
            getBookedTables: jest.fn(),
          },
        },
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    service = module.get<ReservationService>(ReservationService);
    reservationRepo = module.get<Repository<Reservation>>(reservationToken);
    restaurantRepo = module.get<Repository<Restaurant>>(restaurantToken);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('restaurantService should be defined', () => {
    expect(restaurantService).toBeDefined();
  });

  it('reservationRepo should be defined', () => {
    expect(reservationRepo).toBeDefined();
  });

  describe('create', () => {
    const createReservationDto = {
      restaurant_id: 1,
      number_people: 2,
      date: '2030-01-01',
      user_id: 1,
    } as CreateReservationDto;

    const restaurant = {
      id: 1,
      tables: 5,
    } as Restaurant;

    const reservation = {
      id: 1,
      date: new Date('2030-01-01'),
      number_people: 2,
      restaurant_id: 1,
    } as Reservation;

    it('should create a reservation', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValueOnce(restaurant);
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValue(0);
      jest.spyOn(reservationRepo, 'create').mockReturnValueOnce(reservation);
      jest.spyOn(reservationRepo, 'save').mockResolvedValueOnce(reservation);

      const result = await service.create(createReservationDto);

      expect(restaurantService.findOne).toHaveBeenCalledWith(1);
      expect(restaurantService.getBookedTables).toHaveBeenCalledWith(1, '2030-01-01');
      expect(reservationRepo.create).toHaveBeenCalledWith({
        date: new Date('2030-01-01'),
        number_people: 2,
        restaurant_id: 1,
        customers: [{ id: 1 }],
      });
      expect(reservationRepo.save).toHaveBeenCalledWith(reservation);
      expect(result).toEqual(reservation);
    });

    it('should throw NotFoundException if restaurant is not found', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValue(null);

      await expect(service.create(createReservationDto)).rejects.toThrow(NotFoundException);
      expect(restaurantService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw HttpException if no tables are available', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValue(restaurant);
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValue(5);

      await expect(service.create(createReservationDto)).rejects.toThrow(HttpException);
      expect(restaurantService.findOne).toHaveBeenCalledWith(1);
      expect(restaurantService.getBookedTables).toHaveBeenCalledWith(1, '2030-01-01');
    });

    it('should throw HttpException if date is invalid', async () => {
      createReservationDto.date = '2020-01-01';
      jest.spyOn(restaurantService, 'findOne').mockResolvedValue(restaurant);
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValue(0);

      await expect(service.create(createReservationDto)).rejects.toThrow(HttpException);
      expect(restaurantService.findOne).toHaveBeenCalledWith(1);
      expect(restaurantService.getBookedTables).toHaveBeenCalledWith(1, '2020-01-01');
    });
  });

  describe('addCustomer', () => {
    const params = {
      customer_id: 1,
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

      expect(reservationRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(reservationRepo.update).toHaveBeenCalledWith(
        { id: 1 },
        { customers: [...reservation.users, { id: 1 }] },
      );
      expect(result).toEqual(true);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);

      await expect(service.addCustomer(params)).rejects.toThrow(NotFoundException);
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

    it('should throw NotFoundException if reservation is not found', async () => {
      const id = 1;

      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);

      await expect(service.getMenuWithOrdersQuantityByIdReservation(id)).rejects.toThrow(NotFoundException);
    });
  });
});