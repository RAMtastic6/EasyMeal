import { Injectable } from '@nestjs/common';
import { CreateDaysopenDto } from './dto/create-daysopen.dto';
import { UpdateDaysopenDto } from './dto/update-daysopen.dto';

@Injectable()
export class DaysopenService {
  create(createDaysopenDto: CreateDaysopenDto) {
    return 'This action adds a new daysopen';
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
