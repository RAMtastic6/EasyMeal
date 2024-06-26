import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { StaffModule } from '../staff/staff.module';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { DaysopenModule } from '../daysopen/daysopen.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),
    StaffModule,
    RestaurantModule,
    DaysopenModule
  ],
  exports: [TypeOrmModule, UserService]
})
export class UserModule { }
