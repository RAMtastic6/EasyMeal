import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { Repository } from 'typeorm';

describe('OrdersService', () => {
  let service: OrdersService;
  const ORDERS_REPOSITORY_TOKEN = getRepositoryToken(Orders);
  let ordersRepo: Repository<Orders>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrdersService,
        {
          provide: ORDERS_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
          },
        }
      ],
    }).compile();

    ordersRepo = module.get<Repository<Orders>>(ORDERS_REPOSITORY_TOKEN);
    service = module.get<OrdersService>(OrdersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
