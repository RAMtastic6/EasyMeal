import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { HttpException, NotFoundException } from '@nestjs/common';

describe('RestaurantController', () => {
  let controller: RestaurantController;
  let service: RestaurantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RestaurantController],
      providers: [
        {
          provide: RestaurantService,
          useValue: {
            getFilteredRestaurants: jest.fn(),
            create: jest.fn(),
            findAll: jest.fn(),
            findAllCuisines: jest.fn(),
            findAllCities: jest.fn(),
            findOne: jest.fn(),
            findMenuByRestaurantId: jest.fn(),
            getBookedTables: jest.fn(),
            getMenuByRestaurantId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
  });

  it('controller should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFilteredRestaurants', () => {
    it('should call restaurantService.getFilteredRestaurants with the provided query', () => {
      const query = {
        date: '2022-01-01',
        name: 'Restaurant',
        city: 'City',
        cuisine: 'Cuisine',
      };

      controller.getFilteredRestaurants(query);

      expect(service.getFilteredRestaurants).toHaveBeenCalledWith(query);
    });
  });

  describe('create', () => {
    it('should call restaurantService.create with the provided createRestaurantDto', () => {
      const createRestaurantDto: CreateRestaurantDto = {
        id: 0,
        name: '',
        address: '',
        city: '',
        cuisine: '',
        daysOpen: '',
        phone_number: '',
        email: ''
      };
      controller.create(createRestaurantDto);
      expect(service.create).toHaveBeenCalledWith(createRestaurantDto);
    });
  });

  describe('findAll', () => {
    it('should call restaurantService.findAll', () => {
      controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllCuisines', () => {
    it('should call restaurantService.findAllCuisines', () => {
      controller.findAllCuisines();
      expect(service.findAllCuisines).toHaveBeenCalled();
    });
  });

  describe('findAllCities', () => {
    it('should call restaurantService.findAllCities', () => {
      controller.findAllCities();
      expect(service.findAllCities).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should call restaurantService.findOne with the provided id', () => {
      const id = '1';
      controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });
  });

  describe('findMenuByRestaurantId', () => {
    it('should call restaurantService.findMenuByRestaurantId with the provided id', () => {
      const id = '1';
      controller.findMenuByRestaurantId(id);
      expect(service.findMenuByRestaurantId).toHaveBeenCalledWith(+id);
    });
  });

  describe('getBookedTables', () => {
    it('should call restaurantService.getBookedTables with the provided id and date', () => {
      const id = '1';
      const date = '2022-01-01';
      controller.getBookedTables(id, date);
      expect(service.getBookedTables).toHaveBeenCalledWith(+id, date);
    });
  });

  describe('getMenuByRestaurantId', () => {
    it('should call the method with the provided id', async () => {
      const id = '1';
      const result = {} as Restaurant;
      jest.spyOn(service, 'getMenuByRestaurantId').mockResolvedValueOnce(result);
      expect(controller.getMenuByRestaurantId(id)).resolves.toBe(result);
    });

    it('should throw NotFoundException if the result is null', async () => {
      const id = '1';
      jest.spyOn(service, 'getMenuByRestaurantId').mockResolvedValue(null);
      await expect(controller.getMenuByRestaurantId(id)).rejects.toThrow(HttpException).catch((e) => {
        expect(e.message).toBe('Reservation not found');
      });
    });
  });
});
