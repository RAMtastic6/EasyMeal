import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Orders } from './entities/order.entity';
import { OrderIngredients } from './entities/order_ingredients';
import { FoodModule } from '../food/food.module';
import { ReservationModule } from '../reservation/reservation.module';
import { AuthenticationModule } from '../authentication/authentication.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Orders, OrderIngredients]),
    FoodModule,
    ReservationModule,
    AuthenticationModule
  ],
  exports: [TypeOrmModule, OrdersService]
})
export class OrdersModule {}
