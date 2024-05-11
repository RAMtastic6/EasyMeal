import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Menu } from './entities/menu.entity';
import { Day } from './entities/daysopen.entity';
import { Ingredient } from './entities/ingredient.entity';
import { Food } from './entities/food.entity';

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService],
  imports: [TypeOrmModule.forFeature([
    Restaurant,
    Menu,
    Day,
    Food,
    Ingredient,
  ])],
  exports: [TypeOrmModule, RestaurantService]
})
export class RestaurantModule {}
