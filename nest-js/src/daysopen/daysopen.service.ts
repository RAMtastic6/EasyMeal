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
}
