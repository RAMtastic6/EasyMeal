import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { ReservationGruop } from './entities/reservation_group.enity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { RestaurantService } from 'src/restaurant/restaurant.service';
import { Food } from './entities/food.entity';
import { FoodIngredient } from './entities/food_ingredient.entity';
import { Menu } from '../restaurant/entities/menu.entity';
import { Ingredient } from './entities/ingredient.entity';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [TypeOrmModule.forFeature([
    Reservation,
    ReservationGruop,
    Food,
    FoodIngredient,
    Ingredient
  ]), RestaurantModule],
  exports: [TypeOrmModule, ReservationService]
})
export class ReservationModule {}
