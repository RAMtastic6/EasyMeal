import { Test, TestingModule } from '@nestjs/testing';
import { FoodController } from './food.controller';
import { FoodService } from './food.service';
import { NotFoundException } from '@nestjs/common';
import { Food } from './entities/food.entity';

describe('FoodController', () => {
  let controller: FoodController;
  let service: FoodService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodController],
      providers: [{
        provide: FoodService,
        useValue: {
          findOne: jest.fn(),
        },
      }],
    }).compile();

    controller = module.get<FoodController>(FoodController);
    service = module.get<FoodService>(FoodService);
  });

  describe('findOne', () => {
    it('should return the food with the given id', async () => {
      // Arrange
      const id = '1';
      const food = { id: 1, name: 'Pizza' } as Food;
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(food);

      // Act
      const result = await controller.findOne(id);

      // Assert
      expect(result).toEqual(food);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if food is not found', async () => {
      // Arrange
      const id = '1';
      jest.spyOn(service, 'findOne').mockResolvedValueOnce(null);

      // Act & Assert
      await expect(controller.findOne(id)).rejects.toThrow(NotFoundException)
        .catch((error) => {
          expect(error.message).toBe(`Food with id ${id} not found`);
        });
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });
});