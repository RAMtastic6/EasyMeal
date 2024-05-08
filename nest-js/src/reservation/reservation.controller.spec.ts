import { Test, TestingModule } from '@nestjs/testing';
import { ReservationController } from './reservation.controller';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';

describe('ReservationController', () => {
  let controller: ReservationController;
  let service: ReservationService;

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
            getOrdersWithQuantityByIdReservation: jest.fn(),
          },
        }
      ],
    }).compile();

    controller = module.get<ReservationController>(ReservationController);
    service = module.get<ReservationService>(ReservationService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new reservation', async () => {
      const createReservationDto = {} as CreateReservationDto;
      await controller.create(createReservationDto);
      expect(service.create).toHaveBeenCalledWith(createReservationDto);
    });
  });

  describe('addCustomer', () => {
    it('should add a customer to a reservation', async () => {
      const params = {
        customer_id: 1,
        reservation_id: 1,
      };
      await controller.addCustomer(params);
      expect(service.addCustomer).toHaveBeenCalledWith(params);
    });
  });

  describe('findAll', () => {
    it('should return an array of reservations', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a reservation by id', async () => {
      const id = '1';
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('getOrdersWithClients', () => {
    it('should return orders with clients by reservation id', async () => {
      const id = 1;
      await controller.getOrdersWithClients(id);
      expect(service.getOrdersWithQuantityByIdReservation).toHaveBeenCalledWith(id);
    });
  });
});