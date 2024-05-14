import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { Food } from '../menu/entities/food.entity';
import { FoodIngredient } from '../restaurant/entities/food_ingredient.entity';
import { Ingredient } from '../restaurant/entities/ingredient.entity';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [TypeOrmModule.forFeature([
    Reservation,
    Food,
    FoodIngredient,
    Ingredient,
  ]), RestaurantModule],
  exports: [TypeOrmModule, ReservationService]
})
export class ReservationModule {}
