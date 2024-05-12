import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { OrderIngredients } from './entities/order_ingredients';
import { Ingredient } from '../restaurant/entities/ingredient.entity';
import { FoodModule } from '../food/food.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Orders, OrderIngredients]),
    FoodModule
  ],
  exports: [TypeOrmModule]
})
export class OrdersModule {}
