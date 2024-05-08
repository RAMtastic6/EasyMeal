import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food.service';
import { Food } from './entities/food.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FoodService', () => {
  let service: FoodService;
  let repo: Repository<Food>;
  const foodToken = getRepositoryToken(Food);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodService, 
        {
          provide: foodToken,
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        }
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
    repo = module.get<Repository<Food>>(foodToken);
  });

  it('service hould be defined', () => {
    expect(service).toBeDefined();
  });

  it('repo should be defined', () => {
    expect(repo).toBeDefined();
  });
});
