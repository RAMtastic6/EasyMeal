import { Test, TestingModule } from '@nestjs/testing';
import { DaysopenService } from './daysopen.service';
import { Daysopen } from './entities/daysopen.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DaysopenService', () => {
  let service: DaysopenService;
  let repo: Repository<Daysopen>;
  const daysopenToken = getRepositoryToken(Daysopen);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DaysopenService, 
        {
          provide: daysopenToken,
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

    service = module.get<DaysopenService>(DaysopenService);
    repo = module.get<Repository<Daysopen>>(daysopenToken);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repo should be defined', () => {
    expect(repo).toBeDefined();
  });
});
