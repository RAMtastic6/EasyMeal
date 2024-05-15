import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';
import { Ingredient } from './entities/ingredient.entity';

@Module({
  controllers: [FoodController],
  providers: [FoodService],
  imports: [TypeOrmModule.forFeature([Food, Ingredient])],
  exports: [FoodService, TypeOrmModule]
})
export class FoodModule {}
