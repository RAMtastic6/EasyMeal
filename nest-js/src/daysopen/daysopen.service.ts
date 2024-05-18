import { Injectable } from '@nestjs/common';
import { CreateDaysopenDto } from './dto/create-daysopen.dto';
import { UpdateDaysopenDto } from './dto/update-daysopen.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
      /*const existingDay = await this.daysopenRepository.findOne({ where: { restaurantId: restaurant_id, dayOpen: day.day_open } });
      if (existingDay) {
        throw new Error('Days open already set');
      }
      */
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

  findAll() {
    return `This action returns all daysopen`;
  }

  findOne(id: number) {
    return `This action returns a #${id} daysopen`;
  }

  update(id: number, updateDaysopenDto: UpdateDaysopenDto) {
    return `This action updates a #${id} daysopen`;
  }

  remove(id: number) {
    return `This action removes a #${id} daysopen`;
  }
}
