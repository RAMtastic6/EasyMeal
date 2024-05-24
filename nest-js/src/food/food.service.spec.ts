import { Test, TestingModule } from '@nestjs/testing';
import { FoodService } from './food.service';
import { Repository } from 'typeorm';
import { Food } from './entities/food.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('FoodService', () => {
  let service: FoodService;
  let foodRepository: Repository<Food>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FoodService,
        {
          provide: getRepositoryToken(Food),
          useClass: jest.fn(() => ({
            findOne: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<FoodService>(FoodService);
    foodRepository = module.get<Repository<Food>>(getRepositoryToken(Food));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should call foodRepository.findOne with the provided id', async () => {
      const id = 1;
      await service.findOne(id);
      expect(foodRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: id,
        },
        relations: {
          ingredients: true,
        },
      });
    });
  });
});