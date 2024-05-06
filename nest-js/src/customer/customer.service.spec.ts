import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import { In, Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Orders } from 'src/orders/entities/order.entity';

describe('CustomerService', () => {
  let service: CustomerService;
  let jwtService: JwtService;
  const USER_REPOSITORY_TOKEN = getRepositoryToken(Customer);
  const ORDERS_REPOSITORY_TOKEN = getRepositoryToken(Orders);
  let customerRepo: Repository<Customer>;

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
          provide: ORDERS_REPOSITORY_TOKEN,
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
