import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { RestaurantService } from '../restaurant/restaurant.service';
import { StaffService } from '../staff/staff.service';

describe('UserService', () => {
  let service: UserService;
  let jwtService: JwtService;
  let customerRepo: Repository<User>;
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

    service = module.get<UserService>(UserService);
    customerRepo = module.get<Repository<User>>(USER_REPOSITORY_TOKEN);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('customer service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('jwt service should be defined', () => {
    expect(jwtService).toBeDefined();
  });

  it('customer repository should be defined', () => {
    expect(customerRepo).toBeDefined();
  });

  describe('create_user', () => {
    it('should find that a email is already used', async () => {
      const customerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(customerDto as User);
      expect(() => service.create_user(customerDto)).rejects.toThrow(HttpException)
        .catch(e => { expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST); });
    });

    it('should throw an exception if input is invalid', async () => {
      const customerDto = { name: 't', surname: 't', email: 't', password: '' };
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(null);
      expect(() => service.create_user(customerDto)).rejects.toThrow(HttpException).catch(e => {
        expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
      });
    });

    it('should create a customer', async () => {
      const customerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      const customer = { id: 1, name: 'test', surname: 'test', email: 'test', password: 'test' };
      jest.spyOn(customerRepo, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(customerRepo, 'create').mockReturnValueOnce(customer as User);
      jest.spyOn(customerRepo, 'save').mockResolvedValueOnce(customer as User);
      const result = await service.create_user(customerDto);
      expect(result).toEqual(customer);
    });
  });

  /*describe('create', () => {
    it('should create a customer', async () => {
      const createCustomerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      const customer = { id: 1, name: 'test', surname: 'test', email: 'test', password: 'test' };
      jest.spyOn(customerRepo, 'create').mockReturnValue(customer as Customer);
      const result = await service.create(createCustomerDto);
      expect(result).toEqual(customer);
    });

    it('should throw an exception if email is already registered', async () => {
      const createCustomerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      const customer = { id: 1, name: 'test', surname: 'test', email: 'test', password: 'test' };
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(customer as Customer);
      try {
        await service.create(createCustomerDto);
      } catch (e) {
        expect(e.message).toEqual('Email already registered');
      }
    });

    it('should throw an exception if input is invalid', async () => {
      const createCustomerDto = { name: 't', surname: 't', email: 't', password: '' };
      try {
        await service.create(createCustomerDto);
      } catch (e) {
        expect(e.message).toEqual('Invalid input');
      }
    });
  });*/
});
