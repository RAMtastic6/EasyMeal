import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantController } from './restaurant.controller';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';

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
            getBookedTables: jest.fn(),
            getRestaurantAndMenuByRestaurantId: jest.fn(),
            getNumberOfFilteredRestaurants: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RestaurantController>(RestaurantController);
    service = module.get<RestaurantService>(RestaurantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilteredRestaurants', () => {
    it('should call restaurantService.getFilteredRestaurants with the provided query', 
    async () => {
      const query = {
        date: '2022-01-01',
        name: 'Restaurant',
        city: 'City',
        cuisine: 'Cuisine',
      };
      await controller.getFilteredRestaurants(query, 1, 1);
      expect(service.getFilteredRestaurants).toHaveBeenCalledWith(query, 1, 1);
    });
  });

  describe('create', () => {
    it('should call restaurantService.create with the provided createRestaurantDto',
    async () => {
      const createRestaurantDto: CreateRestaurantDto = {
        name: 'test',
        address: 'test',
        city: 'test',
        cuisine: 'test',
        phone_number: 'test',
        email: 'test',
        tables: 1,
        description: ''
      };
      jest.spyOn(service, 'create').mockResolvedValueOnce({} as any);
      await controller.create(createRestaurantDto);
      expect(service.create).toHaveBeenCalledWith(createRestaurantDto);
    });

    it('should throw BadRequestException if result is null', async () => {
      const createRestaurantDto: CreateRestaurantDto = {
        name: '',
        address: '',
        city: '',
        cuisine: '',
        phone_number: '',
        email: '',
        tables: 0,
        description: ''
      };
      jest.spyOn(service, 'create').mockReturnValueOnce(null);
      await expect(controller.create(createRestaurantDto)).rejects.toThrow(BadRequestException);
      expect(service.create).toHaveBeenCalledWith(createRestaurantDto);
    });
  });

  describe('findAll', () => {
    it('should call restaurantService.findAll', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findAllCuisines', () => {
    it('should call restaurantService.findAllCuisines', async () => {
      await controller.findAllCuisines();
      expect(service.findAllCuisines).toHaveBeenCalled();
    });
  });

  describe('findAllCities', () => {
    it('should call restaurantService.findAllCities', async () => {
      await controller.findAllCities();
      expect(service.findAllCities).toHaveBeenCalled();
    });
  });

  describe('getNumberOfFilteredRestaurants',() => {
    it('should call restaurantService.getNumberOfFilteredRestaurants with the provided query', async () => {
      const query = {
        date: '2022-01-01',
        name: 'Restaurant',
        city: 'City',
        cuisine: 'Cuisine',
      };
      await controller.getNumberOfFilteredRestaurants(query);
      expect(service.getNumberOfFilteredRestaurants).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should call restaurantService.findOne with the provided id', async () => {
      const id = 1;
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('getBookedTables', () => {
    it('should call restaurantService.getBookedTables with the provided id and date', 
    async () => {
      const id = 1;
      const date = '2022-01-01';
      await controller.getBookedTables(id, date);
      expect(service.getBookedTables).toHaveBeenCalledWith(id, date);
    });
  });

  describe('getRestaurantAndMenuByRestaurantId', () => {
    it('should call restaurantService.getRestaurantAndMenuByRestaurantId with the provided id', async () => {
      const id = 1;
      const result = {} as Restaurant;
      jest.spyOn(service, 'getRestaurantAndMenuByRestaurantId').mockResolvedValueOnce(result);
      await expect(controller.getRestaurantAndMenuByRestaurantId(id)).resolves.toBe(result);
      expect(service.getRestaurantAndMenuByRestaurantId).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if result is null', async () => {
      const id = 1;
      jest.spyOn(service, 'getRestaurantAndMenuByRestaurantId').mockResolvedValue(null);
      await expect(controller.getRestaurantAndMenuByRestaurantId(id)).rejects.toThrow(NotFoundException);
      expect(service.getRestaurantAndMenuByRestaurantId).toHaveBeenCalledWith(id);
    });
  });
});