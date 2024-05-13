import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { Days, Daysopen } from './entities/daysopen.entity';

@Module({
  controllers: [RestaurantController],
  providers: [RestaurantService],
  imports: [TypeOrmModule.forFeature([
    Restaurant,
    Daysopen
  ])],
  exports: [TypeOrmModule, RestaurantService]
})
export class RestaurantModule {}
