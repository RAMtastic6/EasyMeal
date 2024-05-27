import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderIngredients } from './entities/order_ingredients';
import { FoodModule } from '../food/food.module';
import { ReservationModule } from '../reservation/reservation.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { NotificationModule } from '../notification/notification.module';
import { StaffModule } from 'src/staff/staff.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService],
  imports: [
    TypeOrmModule.forFeature([Order, OrderIngredients]),
    FoodModule,
    ReservationModule,
    AuthenticationModule,
    NotificationModule,
    StaffModule
  ],
  exports: [TypeOrmModule, OrdersService]
})
export class OrdersModule {}
