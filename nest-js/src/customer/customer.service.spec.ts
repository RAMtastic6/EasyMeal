import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('CustomerService', () => {
  let service: CustomerService;
  let jwtService: JwtService;
  let customerRepo: Repository<Customer>;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(Customer);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
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
        }
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    customerRepo = module.get<Repository<Customer>>(USER_REPOSITORY_TOKEN);
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

  describe('create', () => {
    it('should find that a email is already used', async () => {
      const customerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(customerDto as Customer);
      try {
        await service.create(customerDto);
      } catch (e) {
        if(e instanceof HttpException) {
          expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
        }
      }
    });

    it('should throw an exception if input is invalid', async () => {
      const customerDto = { name: 't', surname: 't', email: 't', password: '' };
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(null);
      expect(() => service.create(customerDto)).rejects.toThrow(HttpException).catch(e => {
        expect(e.getStatus()).toEqual(HttpStatus.BAD_REQUEST);
      });
    });

    it('should create a customer', async () => {
      const customerDto = { name: 'test', surname: 'test', email: 'test', password: 'test' };
      const customer = { id: 1, name: 'test', surname: 'test', email: 'test', password: 'test' };
      jest.spyOn(customerRepo, 'findOne').mockResolvedValue(null);
      jest.spyOn(customerRepo, 'create').mockReturnValue(customer as Customer);
      jest.spyOn(customerRepo, 'save').mockResolvedValue(customer as Customer);
      const result = await service.create(customerDto);
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
