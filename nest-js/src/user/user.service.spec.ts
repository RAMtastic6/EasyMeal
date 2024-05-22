import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { DataSource, EntityManager, QueryRunner, Repository, createQueryBuilder } from 'typeorm';
import { UserDto } from './dto/create-user.dto';
import { hashPassword } from '../utils';
import { AdminDto } from './dto/create-admin.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { DaysopenService } from '../daysopen/daysopen.service';
import { StaffService } from '../staff/staff.service';
import { Staff, StaffRole } from '../staff/enities/staff.entity';
import { Daysopen } from '../daysopen/entities/daysopen.entity';
import { Restaurant } from '../restaurant/entities/restaurant.entity';
import { start } from 'repl';
import { create } from 'domain';

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;
  let restaurantService: RestaurantService;
  let dayService: DaysopenService;
  let staffService: StaffService;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: DataSource,
          useValue: {
            manager: jest.fn(),
            createQueryRunner: jest.fn(),
          },
        },
        {
          provide: RestaurantService,
          useValue: {
            createManager: jest.fn(),
          },
        },
        {
          provide: DaysopenService,
          useValue: {
            create_manager: jest.fn(),
          },
        },
        {
          provide: StaffService,
          useValue: {
            create_manager: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
    restaurantService = module.get<RestaurantService>(RestaurantService);
    dayService = module.get<DaysopenService>(DaysopenService);
    staffService = module.get<StaffService>(StaffService);
    dataSource = module.get<DataSource>(DataSource);
  });

  describe('create_user', () => {
    it('should create a new user', async () => {
      const userDto: UserDto = {
        email: 'test@example.com',
        name: 'John',
        surname: 'Doe',
        password: 'password',
      };

      const hashedPassword = 'hashedPassword';

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(repository, 'create').mockReturnValueOnce({
        ...userDto,
        password: hashedPassword,
      } as User);
      jest.spyOn(repository, 'save').mockResolvedValueOnce({
        ...userDto,
        password: hashedPassword,
      } as User);

      const createdUser = await service.create_user(userDto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(repository.create).toHaveBeenCalled();
      expect(repository.save).toHaveBeenCalled()
      expect(createdUser).toEqual({ ...userDto, password: hashedPassword });
    });

    it('should return null if email is already registered', async () => {
      const userDto: UserDto = {
        email: 'test@example.com',
        name: 'John',
        surname: 'Doe',
        password: 'password',
      };

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce({} as any);

      const createdUser = await service.create_user(userDto);

      expect(repository.findOne).toHaveBeenCalled();
      expect(createdUser).toBeNull();
    });

    it('should return null if any required field is missing', async () => {
      const userDto: UserDto = {
        email: '',
        name: 'John',
        surname: 'Doe',
        password: 'password',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(null);
      const createdUser = await service.create_user(userDto);

      expect(createdUser).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const userId = 1;
      const user = { id: userId, email: 'test@example.com', name: 'John', surname: 'Doe' } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const foundUser = await service.findOne(userId);

      expect(repository.findOne).toHaveBeenCalled();
      expect(foundUser).toEqual(user);
    });
  });

  describe('findUserByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';
      const user = { id: 1, email, name: 'John', surname: 'Doe' } as User;

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(user);

      const foundUser = await service.findUserByEmail(email);

      expect(repository.findOne).toHaveBeenCalled();
      expect(foundUser).toEqual(user);
    });
  });

  describe('create_admin', () => {
    it('should create an admin successfully', async () => {
      const data = {
        email: 'admin@example.com',
        name: 'Admin',
        surname: 'User',
        password: 'password',
        restaurant: {
          name: 'Restaurant',
          address: '123 Main St',
        },
        dayopen: {
          days_open: ['Monday', 'Tuesday', 'Wednesday'],
        },
      } as unknown as AdminDto;
  
      const user = { id: 1, ...data } as unknown as User;
      const restaurant = { id: 1, ...data.restaurant } as Restaurant;
      const staff = { id: 1, role: StaffRole.ADMIN, restaurant_id: restaurant.id, user_id: user.id } as Staff;
  
      jest.spyOn(service, 'create_user_manager').mockResolvedValueOnce(user);
      jest.spyOn(restaurantService, 'createManager').mockResolvedValueOnce(restaurant);
      jest.spyOn(staffService, 'create_manager').mockResolvedValueOnce(staff);
      jest.spyOn(dayService, 'create_manager').mockResolvedValueOnce(true);

      const queryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOne: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
        } as unknown as EntityManager,
      } as unknown as QueryRunner;
  
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(queryRunner);
  
      const result = await service.create_admin(data);
  
      expect(service.create_user_manager).toHaveBeenCalledWith(
        {
          email: data.email,
          name: data.name,
          surname: data.surname,
          password: data.password,
        },
        expect.anything()
      );
      expect(restaurantService.createManager).toHaveBeenCalledWith(data.restaurant, expect.anything());
      expect(staffService.create_manager).toHaveBeenCalledWith(
        {
          role: StaffRole.ADMIN,
          restaurant_id: restaurant.id,
          user_id: user.id,
        },
        expect.anything()
      );
      expect(dayService.create_manager).toHaveBeenCalledWith(
        {
          restaurant_id: restaurant.id,
          days_open: data.dayopen.days_open,
        },
        expect.anything()
      );
      expect(result).toBeTruthy();
    });
  
    it('should return null if an error occurs during creation', async () => {
      const data = {
        email: 'admin@example.com',
        name: 'Admin',
        surname: 'User',
        password: 'password',
        restaurant: {
          name: 'Restaurant',
          address: '123 Main St',
        },
        dayopen: {
          days_open: ['Monday', 'Tuesday', 'Wednesday'],
        },
      } as unknown as AdminDto;
      
      const queryRunner = {
        connect: jest.fn(),
        startTransaction: jest.fn(),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn(),
        release: jest.fn(),
        manager: {
          findOne: jest.fn(),
          create: jest.fn(),
          save: jest.fn(),
        } as unknown as EntityManager,
      } as unknown as QueryRunner;
  
      jest.spyOn(dataSource, 'createQueryRunner').mockReturnValue(queryRunner);
      jest.spyOn(service, 'create_user_manager').mockRejectedValueOnce(new Error('Database error'));
  
      const result = await service.create_admin(data);
  
      expect(service.create_user_manager).toHaveBeenCalledWith(
        {
          email: data.email,
          name: data.name,
          surname: data.surname,
          password: data.password,
        },
        expect.anything()
      );
      expect(result).toBeNull();
    });
  });
});