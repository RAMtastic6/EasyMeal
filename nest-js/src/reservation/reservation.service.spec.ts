import { Test, TestingModule } from '@nestjs/testing';
import { ReservationService } from './reservation.service';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationGruop } from './entities/reservation_group.enity';
import { RestaurantService } from '../restaurant/restaurant.service';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { NotFoundException, HttpException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';

describe('ReservationService', () => {
  let service: ReservationService;
  let restaurantService: RestaurantService;
  let reservationRepo: Repository<Reservation>;
  let ReservationGruopRepo: Repository<ReservationGruop>;
  let restaurantRepo: Repository<Restaurant>;
  const reservationToken = getRepositoryToken(Reservation);
  const reservationGroupToken = getRepositoryToken(ReservationGruop);
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
          },
        },
        {
          provide: reservationGroupToken,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: restaurantToken,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    restaurantService = module.get<RestaurantService>(RestaurantService);
    service = module.get<ReservationService>(ReservationService);
    reservationRepo = module.get<Repository<Reservation>>(reservationToken);
    ReservationGruopRepo = module.get<Repository<ReservationGruop>>(reservationGroupToken);
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

  it('ReservationGruopRepo should be defined', () => {
    expect(ReservationGruopRepo).toBeDefined();
  });

  describe('create', () => {
    const createReservationDto = {
      restaurant_id: 1,
      number_people: 2,
      date: '2030-01-01',
      customer_id: 1,
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

    const group = {
      reservation_id: 1,
      customer_id: 1,
    } as ReservationGruop;

    it('should create a reservation', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValueOnce(restaurant);
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValue(0);
      jest.spyOn(reservationRepo, 'create').mockReturnValueOnce(reservation);
      jest.spyOn(reservationRepo, 'save').mockResolvedValueOnce(reservation);
      jest.spyOn(ReservationGruopRepo, 'create').mockReturnValueOnce(group);
      jest.spyOn(ReservationGruopRepo, 'save').mockResolvedValueOnce(group);
      const result = await service.create(createReservationDto);
      expect(restaurantService.findOne).toHaveBeenCalledWith(1);
      expect(restaurantService.getBookedTables).toHaveBeenCalledWith(1, '2030-01-01');
      expect(reservationRepo.create).toHaveBeenCalledWith({
        date: new Date('2030-01-01'),
        number_people: 2,
        restaurant_id: 1,
      });
      expect(reservationRepo.save).toHaveBeenCalledWith(reservation);
      expect(ReservationGruopRepo.create).toHaveBeenCalledWith({
        reservation_id: 1,
        customer_id: 1,
      });
      expect(ReservationGruopRepo.save).toHaveBeenCalledWith(group);
      expect(result).toEqual(reservation);
    });

    it('should throw NotFoundException if restaurant is not found', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValue(null);
      expect(service.create(createReservationDto)).rejects.toThrow(NotFoundException);
      expect(restaurantService.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw HttpException if no tables are available', async () => {
      jest.spyOn(restaurantService, 'findOne').mockResolvedValue(restaurant);
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValue(5);
      expect(service.create(createReservationDto)).rejects.toThrow(HttpException).catch((e) => {
        expect(e.message).toEqual('No tables available');
      });
    });

    it('should throw HttpException if date is invalid', async () => {
      createReservationDto.date = '2020-01-01';
      jest.spyOn(restaurantService, 'findOne').mockResolvedValue(restaurant);
      jest.spyOn(restaurantService, 'getBookedTables').mockResolvedValue(0);
      expect(service.create(createReservationDto)).rejects.toThrow(HttpException).catch((e) => {expect(e.message).toEqual('Invalid date')});
    });
  });

  describe('addCustomer', () => {
    const params = {
      customer_id: 1,
      reservation_id: 1,
    };

    const reservation = {
      id: 1,
    } as Reservation;

    const group = {
      reservation_id: 1,
      customer_id: 1,
    } as ReservationGruop;

    it('should add a customer to a reservation', async () => {
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(reservation);
      jest.spyOn(ReservationGruopRepo, 'create').mockReturnValueOnce(group);
      jest.spyOn(ReservationGruopRepo, 'save').mockResolvedValueOnce(group);
      const result = await service.addCustomer(params);
      expect(reservationRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(ReservationGruopRepo.create).toHaveBeenCalledWith({
        reservation_id: 1,
        customer_id: 1,
      });
      expect(ReservationGruopRepo.save).toHaveBeenCalledWith(group);
      expect(result).toEqual(true);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      const params = {
        customer_id: 1,
        reservation_id: 1,
      };
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);
      expect(service.addCustomer(params)).rejects.toThrow(NotFoundException);
      expect(reservationRepo.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const reservations = [
        { id: 1 },
        { id: 2 },
      ] as Reservation[];

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

  describe('getOrdersWithQuantityByIdReservation', () => {
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
              { id: 1, name: 'Pizza', price: 10},
              { id: 2, name: 'Pasta', price: 8 },
            ],
          },
        },
        orders: [
          {
            quantity: 2,
            customer: { id: 1, name: 'John Doe' },
            food: { id: 1, name: 'Pizza', price: 10 },
          },
          {
            quantity: 1,
            customer: { id: 2, name: 'Jane Doe' },
            food: { id: 2, name: 'Pasta', price: 8 },
          },
        ],
      } as unknown as Reservation;
      const final = {
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
      }
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValueOnce(result);
      const response = await service.getOrdersWithQuantityByIdReservation(id);
      expect(response).toEqual(final);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      const id = 1;
      jest.spyOn(reservationRepo, 'findOne').mockResolvedValue(null);
      expect(service.getOrdersWithQuantityByIdReservation(id)).rejects.toThrow(NotFoundException);
    });
  });
});