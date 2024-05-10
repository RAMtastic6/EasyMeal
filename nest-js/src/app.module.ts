import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './restaurant/restaurant.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { OrdersModule } from './orders/orders.module';
import { ReservationModule } from './reservation/reservation.module';
import { StaffModule } from './staff/staff.module';


@Module({
  imports: [RestaurantModule, TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: 'postgres',
      password: 'postgres',
      database: 'easy-meal',
      autoLoadEntities: true,
      synchronize: true, //FIXME: NEVER USE THIS IN PRODUCTION
    }), UserModule, OrdersModule, ReservationModule, StaffModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}