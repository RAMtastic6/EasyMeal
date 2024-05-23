import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from '../authentication/authentication.service';
import { Reservation } from './entities/reservation.entity';
import { StaffRole } from '../staff/enities/staff.entity';
import { verifyReservationDto } from './dto/verify-reservation.dto';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;
  let authService: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationController],
      providers: [
        {
          provide: ReservationService,
          useValue: {
            create: jest.fn(),
            addCustomer: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            getMenuWithOrdersQuantityByIdReservation: jest.fn(),
            getReservationsByRestaurantId: jest.fn(),
            acceptReservation: jest.fn(),
            rejectReservation: jest.fn(),
            getReservationsByUserId: jest.fn(),
            verifyReservation: jest.fn(),
          },
        },
        {
          provide: AuthenticationService,
          useValue: {
            verifyToken: jest.fn(),
          },
        }
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
    authService = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a reservation', async () => {
      const createReservationDto: CreateReservationDto = {
        restaurant_id: 1,
        date: new Date().toISOString(),
        number_people: 2,
        token: 'valid_token',
      };

      const expectedResult = { id: 1, ...createReservationDto };

      jest.spyOn(service, 'create').mockResolvedValue({
        status: true,
        id: expectedResult.id,
        data: expectedResult as any,
      });
      jest.spyOn(authService, 'verifyToken').mockResolvedValue({ id: 1, role: StaffRole.ADMIN});

      const result = await controller.create(createReservationDto);

      expect(service.create).toHaveBeenCalledWith(
        createReservationDto.restaurant_id,
        createReservationDto.date,
        createReservationDto.number_people,
        expect.any(Number),
      );
      expect(result).toEqual({
        status: true,
        id: expectedResult.id,
        data: expectedResult as any,
      });
    });

    it('should throw UnauthorizedException if token is invalid', async () => {
      const createReservationDto: CreateReservationDto = {
        restaurant_id: 1,
        date: new Date().toISOString(),
        number_people: 2,
        token: 'invalid_token',
      };

      jest.spyOn(service, 'create').mockResolvedValue(null);

      await expect(controller.create(createReservationDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException if reservation is invalid', async () => {
      const createReservationDto: CreateReservationDto = {
        restaurant_id: 1,
        date: new Date().toISOString(),
        number_people: 2,
        token: 'valid_token',
      };

      jest.spyOn(service, 'create').mockResolvedValue(null);
      jest.spyOn(authService, 'verifyToken').mockResolvedValue({ id: 1, role: StaffRole.ADMIN});

      await expect(controller.create(createReservationDto)).rejects.toThrowError(
        BadRequestException,
      );
    });
  });

  describe('addCustomer', () => {
    it('should add a customer to a reservation', async () => {
      const params = { user_id: 1, reservation_id: 1 };

      const expectedResult = { id: 1, ...params };

      jest.spyOn(service, 'addCustomer').mockResolvedValue(true);

      const result = await controller.addCustomer(params);

      expect(service.addCustomer).toHaveBeenCalledWith(params);
      expect(result).toEqual(true);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      const params = { user_id: 1, reservation_id: 1 };

      jest.spyOn(service, 'addCustomer').mockResolvedValue(null);

      await expect(controller.addCustomer(params)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findAll', () => {
    it('should return all reservations', async () => {
      const expectedResult = [{ id: 1 }, { id: 2 }] as Reservation[];

      jest.spyOn(service, 'findAll').mockResolvedValue(expectedResult);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if no reservations are found', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      await expect(controller.findAll()).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const id = 1;
      const expectedResult = { id: 1 } as Reservation;

      jest.spyOn(service, 'findOne').mockResolvedValue(expectedResult);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(+id);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      const id = 1;

      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('getMenuWithOrdersQuantityByIdReservation', () => {
    it('should return menu with orders quantity by reservation id', async () => {
      const id = 1;
      const expectedResult = { id: 1 } as Reservation;

      jest
        .spyOn(service, 'getMenuWithOrdersQuantityByIdReservation')
        .mockResolvedValue(expectedResult);

      const result = await controller.getMenuWithOrdersQuantityByIdReservation(id);

      expect(service.getMenuWithOrdersQuantityByIdReservation).toHaveBeenCalledWith(
        id,
      );
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      const id = 1;

      jest
        .spyOn(service, 'getMenuWithOrdersQuantityByIdReservation')
        .mockResolvedValue(null);

      await expect(
        controller.getMenuWithOrdersQuantityByIdReservation(id),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getReservationsByRestaurantId', () => {
    it('should return reservations by restaurant id', async () => {
      const restaurantId = 1;
      const expectedResult = [{ id: 1 }, { id: 2 }] as Reservation[];

      jest.spyOn(service, 'getReservationsByRestaurantId').mockResolvedValue(expectedResult);

      const result = await controller.getReservationsByRestaurantId(restaurantId);

      expect(service.getReservationsByRestaurantId).toHaveBeenCalledWith(restaurantId);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('acceptReservation', () => {
    it('should accept a reservation', async () => {
      const id = 1;
      const expectedResult = { id: 1 } as any;

      jest.spyOn(service, 'acceptReservation').mockResolvedValue(expectedResult);

      const result = await controller.acceptReservation(id);

      expect(service.acceptReservation).toHaveBeenCalledWith(id);
      expect(result).toEqual(expectedResult);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      const id = 1;

      jest.spyOn(service, 'acceptReservation').mockResolvedValue(null);

      await expect(controller.acceptReservation(id)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('rejectReservation', () => {
    it('should reject a reservation', async () => {
      const id = 1;
      const expectedResult = { id: 1 };

      jest.spyOn(service, 'rejectReservation').mockResolvedValue(true);

      const result = await controller.rejectReservation(id);

      expect(service.rejectReservation).toHaveBeenCalledWith(id);
      expect(result).toEqual(true);
    });

    it('should throw NotFoundException if reservation is not found', async () => {
      const id = 1;

      jest.spyOn(service, 'rejectReservation').mockResolvedValue(null);

      await expect(controller.rejectReservation(id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getReservationsByUserId', () => {
    it('should return reservations by user Id', async () =>{

      jest.spyOn(service,'getReservationsByUserId').mockResolvedValue([])
      expect(await controller.getReservationsByUserId(1)).toEqual([])
    })
  })

  describe('verifyReservation', () => {
    it('should verify a reservation', async () => {
      const verifyReservationDto = {
        id_prenotazione: 1,
        token: 'valid_token',
      } as verifyReservationDto;
  
      const expectedResult = { id: 1 } as any;
  
      jest.spyOn(authService, 'verifyToken').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(service, 'verifyReservation').mockResolvedValue(expectedResult);
  
      const result = await controller.verifyReservation(verifyReservationDto);
  
      expect(authService.verifyToken).toHaveBeenCalledWith(verifyReservationDto.token);
      expect(service.verifyReservation).toHaveBeenCalledWith(
        verifyReservationDto.id_prenotazione, 1);
      expect(result).toEqual(expectedResult);
    });
  
    it('should throw UnauthorizedException if token is invalid', async () => {
      const verifyReservationDto = {
        token: 'invalid_token',
        id_prenotazione: 1,
      } as verifyReservationDto;
  
      jest.spyOn(authService, 'verifyToken').mockResolvedValue(null);
  
      await expect(
        controller.verifyReservation(verifyReservationDto)
      ).rejects.toThrow(UnauthorizedException);
    });
  
    it('should throw NotFoundException if reservation is not found', async () => {
      const verifyReservationDto = {
        token: 'valid_token',
        id_prenotazione: 1,
      } as verifyReservationDto;
  
      jest.spyOn(authService, 'verifyToken').mockResolvedValue({ id: 1 } as any);
      jest.spyOn(service, 'verifyReservation').mockResolvedValue(null);
  
      await expect(
        controller.verifyReservation(verifyReservationDto)
      ).rejects.toThrow(NotFoundException);
    });
  });
});