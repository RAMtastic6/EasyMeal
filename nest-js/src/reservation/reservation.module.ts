import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { RestaurantModule } from 'src/restaurant/restaurant.module';
import { NotificationModule } from '../notification/notification.module';
import { StaffModule } from '../staff/staff.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [ReservationController],
  providers: [ReservationService],
  imports: [TypeOrmModule.forFeature([Reservation]), 
    RestaurantModule,
    NotificationModule,
    StaffModule,
    AuthenticationModule,
    UserModule,
  ],
  exports: [TypeOrmModule, ReservationService]
})
export class ReservationModule {}
