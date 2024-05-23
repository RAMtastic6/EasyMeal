import { Injectable } from '@nestjs/common';
import { CreateDaysopenDto } from './dto/create-daysopen.dto';
import { UpdateDaysopenDto } from './dto/update-daysopen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Daysopen } from './entities/daysopen.entity';

@Injectable()
export class DaysopenService {
  constructor(
    @InjectRepository(Daysopen)
    private daysopenRepository: Repository<Daysopen>,
  ) {}

  async create(createDaysopenDto: CreateDaysopenDto) {
    const { restaurant_id, days_open } = createDaysopenDto;
    //Create the entries
    if (days_open && days_open.length > 0) {
      for (const day of days_open) {
      const daysopen = this.daysopenRepository.create({
        restaurantId: restaurant_id,
        dayOpen: day.day_open,
        opening: day.opening,
        closing: day.closing
      });
      await this.daysopenRepository.save(daysopen);
      }
    }
    return true;
  }

  async create_manager(createDaysopenDto: CreateDaysopenDto,
    manager: EntityManager) {
    const { restaurant_id, days_open } = createDaysopenDto;
    //Create the entries
    if (days_open && days_open.length > 0) {
      for (const day of days_open) {
      const daysopen = manager.create(Daysopen, {
        restaurantId: restaurant_id,
        dayOpen: day.day_open,
        opening: day.opening,
        closing: day.closing
      });
      await manager.save(daysopen);
      }
    }
    return true;
  }
}
