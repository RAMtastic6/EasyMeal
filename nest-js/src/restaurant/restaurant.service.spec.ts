import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { RestaurantService } from './restaurant.service';
import { Restaurant } from './entities/restaurant.entity';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { Daysopen } from '../daysopen/entities/daysopen.entity';

describe('RestaurantService', () => {
  let service: RestaurantService;
  let repo: Repository<Restaurant>;
  let manager: EntityManager;
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
        },
        {
          provide: EntityManager,
          useValue: {
            save: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn()
          },
        },
      ],
    }).compile();

    service = module.get<RestaurantService>(RestaurantService);
    repo = module.get<Repository<Restaurant>>(tokenRestaurant);
    manager = module.get<EntityManager>(EntityManager);
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
        cuisine: 'cuisine',
      };
      const queryBuilder = {
        innerJoin: () => queryBuilder,
        andWhere: () => queryBuilder,
        where: () => queryBuilder,
        getMany: jest.fn().mockReturnValue([]),
        skip: () => ({
          take: () => queryBuilder
        })
      };
      jest.spyOn(repo, 'createQueryBuilder').mockImplementation(
        () => queryBuilder as any
      );
      const result = await service.getFilteredRestaurants(query, 1, 1);
      expect(repo.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual([]);
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
      tables: 1,
      description: ''
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
      reservations: [],
    } as Restaurant;

    it('should create a restaurant', async () => {
      jest.spyOn(repo, 'findOne').mockReturnValueOnce(null);
      jest.spyOn(repo, 'create').mockReturnValueOnce(restaurant);
      jest.spyOn(repo, 'save').mockResolvedValueOnce(restaurant);
      const result = await service.create(createRestaurantDto);
      expect(repo.findOne).toHaveBeenCalled();
      expect(repo.create).toHaveBeenCalled();
      expect(repo.save).toHaveBeenCalled();
      expect(result).toEqual(restaurant);
    });

    it('should throw an error if the restaurant already exists', async () => {
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(restaurant);
      await expect(service.create(createRestaurantDto)).resolves.toBe(null);
    });

    it('should throw an error if the input is invalid', async () => {
      delete createRestaurantDto.name;
      expect(await service.create(createRestaurantDto)).toBe(null);
    });
  });

  describe('findAll', () => {
    it('should return an array of restaurants', async () => {
      const restaurants: Restaurant[] = [];
      jest.spyOn(repo, 'find').mockResolvedValueOnce(restaurants);
      const result = await service.findAll();
      expect(repo.find).toHaveBeenCalled();
      expect(result).toEqual(restaurants);
    });
  });

  describe('findAllCuisines', () => {
    it('should return an array of cuisines', async () => {
      const cuisines: string[] = [];
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce(cuisines),
      } as any);
      const result = await service.findAllCuisines();
      expect(repo.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(cuisines);
    });
  });

  describe('findAllCities', () => {
    it('should return an array of cities', async () => {
      const cities: string[] = [];
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        select: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        getRawMany: jest.fn().mockResolvedValueOnce(cities),
      } as any);
      const result = await service.findAllCities();
      expect(repo.createQueryBuilder).toHaveBeenCalled();
      expect(result).toEqual(cities);
    });
  });

  describe('findOne', () => {
    it('should return a restaurant', async () => {
      const id = 0;
      const restaurant: Restaurant = {
        id,
        address: 'address',
        city: 'city',
        cuisine: 'cuisine',
        email: 'email',
        name: 'restaurant',
        phone_number: 'phone_number',
        menu_id: 0,
        tables: 0,
        daysOpen: [],
        reservations: [],
      } as Restaurant;
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(restaurant);
      const result = await service.findOne(id);
      expect(repo.findOne).toHaveBeenCalledWith({ where: { id } });
      expect(result).toEqual(restaurant);
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

  describe('getRestaurantAndMenuByRestaurantId', () => {
    it('should return the restaurant and its menu', async () => {
      const restaurantId = 1;
      const expectedResult: Restaurant = {
        id: 1,
        name: 'Restaurant',
        menu: {
          id: 1,
          foods: [],
        },
      } as Restaurant;
      jest.spyOn(repo, 'findOne').mockResolvedValueOnce(expectedResult);
      const result = await service.getRestaurantAndMenuByRestaurantId(restaurantId);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { id: restaurantId },
        relations: {
          menu: {
            foods: true,
          },
        },
      });
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getNumberOfFilteredRestaurants', () => {
    it('should return the number of filtered restaurants', async () => {
      const query = {
        date: '2021-06-01',
        name: 'restaurant',
        city: 'city',
        cuisine: 'cuisine',
      };
      jest.spyOn(repo, 'createQueryBuilder').mockReturnValue({
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValueOnce(5),
        innerJoin: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
      } as any);
      const result = await service.getNumberOfFilteredRestaurants(query);
      expect(repo.createQueryBuilder).toHaveBeenCalled();
      expect(result).toBe(5);
    });
  });

  describe('createManager', () => {
    const createRestaurantDto: CreateRestaurantDto = {
      address: 'address',
      city: 'city',
      cuisine: 'cuisine',
      email: 'email',
      name: 'restaurant',
      phone_number: 'phone_number',
      tables: 1,
      description: ''
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
      reservations: [],
    } as Restaurant;

    it('should create a restaurant manager', async () => {
      jest.spyOn(manager, 'save').mockResolvedValueOnce(restaurant);
      const result = await service.createManager(createRestaurantDto, manager);
      expect(manager.save).toHaveBeenCalled();
      expect(result).toEqual(restaurant);
    });

    it('should throw an error if the input is invalid', async () => {
      delete createRestaurantDto.name;
      expect(await service.createManager(createRestaurantDto, manager)).toBe(null);
    });
  });
});