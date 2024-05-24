import { Injectable } from '@nestjs/common';
import { CreateFoodDto } from './dto/create-food.dto';
import { UpdateFoodDto } from './dto/update-food.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FoodService {

  constructor(
    @InjectRepository(Food)
    private foodRepository: Repository<Food>
  ) {}

  async findOne(id: number) {
    return await this.foodRepository.findOne({
      where: {
        id: id
      },
      relations: {
        ingredients: true
      }
    });
  }
}
