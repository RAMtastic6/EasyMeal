import { Module } from '@nestjs/common';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from './entities/food.entity';

@Module({
  controllers: [FoodController],
  providers: [FoodService],
  imports: [TypeOrmModule.forFeature([Food])],
  exports: [FoodService]
})
export class FoodModule {}
