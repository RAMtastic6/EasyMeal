import { Test, TestingModule } from '@nestjs/testing';
import { RestaurantService } from './restaurant.service';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { HttpException } from '@nestjs/common';
import { find } from 'rxjs';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repo: Repository<Restaurant>;
  const tokenRestaurant = getRepositoryToken(Restaurant);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RestaurantService,
        {
          provide: tokenRestaurant,
          useValue: {
            createQueryBuilder: jest.fn(),
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            findAndCount: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repo = module.get<Repository<Restaurant>>(tokenRestaurant);
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repo should be defined', () => {
    expect(repo).toBeDefined();
  });

  describe('getFilteredRestaurants', () => {
    it('should return an array of restaurants', async () => {
      const query = {
        date: '2021-06-01',
        name: 'restaurant',
        city: 'city',
        cuisine: 'cuisine'
      };
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        innerJoin: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockReturnValueOnce([])
      } as any);
      await service.getFilteredRestaurants(query);
      expect(repo.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    const createRestaurantDto: CreateRestaurantDto = {
      address: 'address',
      city: 'city',
      cuisine: 'cuisine',
      email: 'email',
      name: 'restaurant',
      phone_number: 'phone_number',
      id: 0,
      daysOpen: ''
    };

    const restaurant: Restaurant = {
      address: 'address',
      city: 'city',
      cuisine: 'cuisine',
      email: 'email',
      name: 'restaurant',
      phone_number: 'phone_number',
      id: 0,
      menu_id: 0,
      tables: 0,
      daysOpen: [],
      reservations: []
    } as Restaurant;

    it('should create a restaurant', async () => {
      jest.spyOn(repo, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(repo, 'create').mockReturnValueOnce(restaurant);
      jest.spyOn(repo, 'save').mockResolvedValueOnce(restaurant);
      await service.create(createRestaurantDto);
      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
    });

    it('should throw an error if the restaurant already exists', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(restaurant);
      await expect(service.create(createRestaurantDto)).rejects.toThrow(HttpException).catch((e) => expect(e.message).toBe('Restaurant already exists'));
    });

    it('should throw an error if the input is invalid', async () => {
      delete createRestaurantDto.name;
      await expect(service.create(createRestaurantDto)).rejects.toThrow(HttpException).catch((e) => expect(e.message).toBe('Invalid input'));
    });
  });

  describe('findAll', () => {
    it('should return an array of restaurants', async () => {
      jest.spyOn(repo, 'find').mockResolvedValueOnce([]);
      await service.findAll();
      expect(repo.find).toHaveBeenCalled();
    });
  });

  describe('findAllCuisines', () => {
    it('should return an array of cuisines', async () => {
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([])
      } as any);
      await service.findAllCuisines();
      expect(repo.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findAllCities', () => {
    it('should return an array of cities', async () => {
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce([])
      } as any);
      await service.findAllCities();
      expect(repo.createQueryBuilder).toHaveBeenCalled();
    });
  });

  describe('findMenuByRestaurantId', () => {
    it('should return the menu of a restaurant', async () => {
      await service.findMenuByRestaurantId(0);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 0 }, relations: ['menu', 'menu.foods'] });
    });
  });

  describe('findOne', () => {
    it('should return a restaurant', async () => {
      await service.findOne(0);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id: 0 } });
    });
  });

  describe('getBookedTables', () => {
    it('should return the number of booked tables in a restaurant on a specific date', async () => {
      const restaurantId = 1;
      const date = '2021-06-01';
      const expectedResult = 5;
      jest.spyOn(repo, 'findAndCount').mockResolvedValueOnce([[], expectedResult]);
      const result = await service.getBookedTables(restaurantId, date);
      expect(repo.findAndCount).toHaveBeenCalledWith({
        relations: ['reservations'],
        where: {
          id: restaurantId,
          reservations: {
            date: new Date(date),
          },
        },
      });
      expect(result).toBe(expectedResult);
    });
  });
});
