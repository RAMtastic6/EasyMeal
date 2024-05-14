import { Module } from '@nestjs/common';
import { DaysopenService } from './daysopen.service';
import { DaysopenController } from './daysopen.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Daysopen } from './entities/daysopen.entity';

@Module({
  controllers: [DaysopenController],
  providers: [DaysopenService],
  imports: [TypeOrmModule.forFeature([Daysopen])],
  exports: [DaysopenService, TypeOrmModule]
})
export class DaysopenModule {}
