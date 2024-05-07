import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RestaurantService } from '../restaurant/restaurant.service';
import { StaffService } from '../staff/staff.service';
import { AdminDto } from './dto/create-admin.dto';
import * as bycript from '../utils';
import { Restaurant } from '../restaurant/entities/restaurant.entity';

describe('UserService', () => {
  let userService: UserService;
  let jwtService: JwtService;
  let userRepo: Repository<User>;
  let restaurantService: RestaurantService;
  let staffService: StaffService;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(User);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: RestaurantService,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: StaffService,
          useValue: {
            create: jest.fn(),
          },
        }
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepo = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    jwtService = module.get<JwtService>(JwtService);
    restaurantService = module.get<RestaurantService>(RestaurantService);
    staffService = module.get<StaffService>(StaffService);
  });

  it('customer service should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('jwt service should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  it('customer repository should be defined', () => {
    expect(userRepo).toBeDefined();
  });

  describe('create_user', () => {
    it('should find that a email is already used', async () => {
      const customerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(customerDto as User);
      expect(() => userService.create_user(customerDto)).rejects.toThrow(HttpException)
        .catch(e => { expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST); });
    });

    it('should throw an exception if input is invalid', async () => {
      const customerDto = { name: 't', surname: 't', email: 't', password: '' };
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
      expect(() => userService.create_user(customerDto)).rejects.toThrow(HttpException).catch(e => {
        expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
      });
    });

    it('should create a customer', async () => {
      const customerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      const customer = { id: 1, name: 'test', surname: 'test', email: 'test', password: 'hashed-test' };
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(userRepo, 'create').mockReturnValueOnce(customer as User);
      jest.spyOn(userRepo, 'save').mockResolvedValueOnce(customer as User);
      jest.spyOn(bycript, 'hashPassword').mockResolvedValueOnce('hashed-test');
      const result = await userService.create_user(customerDto);
      expect(result).toEqual(customer);
    });
  });

  describe('create_admin', () => {
    describe('create_admin', () => {
      it('should create an admin', async () => {
        const adminDto: AdminDto = {
          name: 'admin', email: 'admin@example.com', password: 'admin123',
          surname: 'admin',
          restaurant_name: '',
          restaurant_address: '',
          restaurant_city: '',
          restaurant_cuisine: '',
          restaurant_tables: 0,
          restaurant_phone_number: '',
          restaurant_email: ''
        };
        const admin = { 
          id: 1, 
          name: 'admin', 
          email: 'admin@example.com', 
          password: 'hashed-admin', 
          role: UserRole.USER,
          surname: 'admin'
        };
        jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
        jest.spyOn(userService, 'create_user').mockResolvedValueOnce(admin as User);
        jest.spyOn(bycript, 'hashPassword').mockResolvedValueOnce('hashed-admin');
        jest.spyOn(restaurantService, 'create').mockResolvedValueOnce({ id: 1 } as Restaurant);
        const result = await userService.create_admin(adminDto);
        expect(result).toEqual(admin);
      });

      it('should throw an exception if email is already used', async () => {
        const adminDto: AdminDto = {
          name: 'admin',
          email: 'admin@example.com',
          password: 'admin123',
          surname: 'admin',
          restaurant_name: '',
          restaurant_address: '',
          restaurant_city: '',
          restaurant_cuisine: '',
          restaurant_tables: 0,
          restaurant_phone_number: '',
          restaurant_email: ''
        };
        const existingAdmin: User = {
          id: 1, name: 'admin',
          email: 'admin@example.com',
          password: 'hashed-admin',
          role: UserRole.USER,
          surname: 'admin',
          orders: [],
          reservation_group: [],
          reservations: []
        };
        jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(existingAdmin);
        await expect(userService.create_admin(adminDto)).rejects.toThrow(HttpException);
      });

      it('should throw an exception if input is invalid', async () => {
        const adminDto: AdminDto = {
          name: 'a', email: 'admin@example.com', password: '',
          surname: '',
          restaurant_name: '',
          restaurant_address: '',
          restaurant_city: '',
          restaurant_cuisine: '',
          restaurant_tables: 0,
          restaurant_phone_number: '',
          restaurant_email: ''
        };
        jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
        await expect(userService.create_admin(adminDto)).rejects.toThrow(HttpException);
      });
    });
  });

  describe('findOne', () => {
    it('should find a user by id', async () => {
      const userId = 1;
      const user = { id: userId, name: 'test', surname: 'test', email: 'test@example.com', password: 'test' };
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user as User);
      const result = await userService.findOne(userId);
      expect(result).toEqual(user);
    });

    it('should throw an exception if user is not found', async () => {
      const userId = 1;
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
      expect(() => userService.findOne(userId)).rejects.toThrow(HttpException).catch(e => {
        expect(e.getStatus()).toEqual(HttpStatus.NOT_FOUND);
      });
    });
  });

  describe('login', () => {
    it('should return a JWT token if login is successful', async () => {
      const email = 'test@example.com';
      const password = 'test123';
      const user = { id: 1, name: 'test', surname: 'test', email: 'test@example.com', password: 'hashed-test' };
      const jwtToken = 'mocked-jwt-token';
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user as User);
      jest.spyOn(bycript, 'comparePasswords').mockResolvedValueOnce(true);
      jest.spyOn(jwtService, 'sign').mockReturnValueOnce(jwtToken);
      const result = await userService.login(email, password);
      expect(result.token).toEqual(jwtToken);
    });

    it('should throw an exception if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'test123';
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(null);
      await expect(userService.login(email, password)).rejects.toThrow(HttpException).catch(e => {
        expect(e.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });

    it('should throw an exception if password is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'test123';
      const user = { id: 1, name: 'test', surname: 'test', email: 'test@example.com', password: 'hashed-test' };
      jest.spyOn(userRepo, 'findOne').mockResolvedValueOnce(user as User);
      jest.spyOn(bycript, 'comparePasswords').mockResolvedValueOnce(false);
      await expect(userService.login(email, password)).rejects.toThrow(HttpException).catch(e => {
        expect(e.getStatus()).toEqual(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});


