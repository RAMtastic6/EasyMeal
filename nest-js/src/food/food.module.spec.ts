import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { Food } from './entities/food.entity';
import { Ingredient } from './entities/ingredient.entity';
import { FoodModule } from './food.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('FoodModule', () => {
  let foodController: FoodController;
  let foodService: FoodService;
  let foodRepository: Repository<Food>;
  let ingredientRepository: Repository<Ingredient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forFeature([Food, Ingredient]),
        FoodModule,
      ],
    })
    .overrideProvider(getRepositoryToken(Food))
    .useValue({
      findOne: jest.fn(),
    })
    .overrideProvider(getRepositoryToken(Ingredient))
    .useValue({})
    .compile();

    foodController = module.get<FoodController>(FoodController);
    foodService = module.get<FoodService>(FoodService);
    foodRepository = module.get<Repository<Food>>(getRepositoryToken(Food));
    ingredientRepository = module.get<Repository<Ingredient>>(getRepositoryToken(Ingredient));
  });

  it('should be defined', () => {
    expect(foodController).toBeDefined();
    expect(foodService).toBeDefined();
  });

  describe('findOne', () => {
    it('should call foodService.findOne and return the result', async () => {
      const id = 1;
      const food = { id, name: 'Pizza' } as Food;
      jest.spyOn(foodService, 'findOne').mockResolvedValueOnce(food);

      const result = await foodController.findOne(id);
      expect(result).toEqual(food);
      expect(foodService.findOne).toHaveBeenCalledWith(id);
    });

    it('should throw NotFoundException if food is not found', async () => {
      const id = 1;
      jest.spyOn(foodService, 'findOne').mockResolvedValueOnce(null);

      await expect(foodController.findOne(id)).rejects.toThrow(NotFoundException)
        .catch((error) => {
          expect(error.message).toBe(`Food with id ${id} not found`);
        });
      expect(foodService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('FoodService', () => {
    it('should call foodRepository.findOne with the provided id', async () => {
      const id = 1;
      await foodService.findOne(id);
      expect(foodRepository.findOne).toHaveBeenCalledWith({
        where: {
          id,
        },
        relations: {
          ingredients: true,
        },
      });
    });
  });
});
