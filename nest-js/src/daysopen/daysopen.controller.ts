import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DaysopenService } from './daysopen.service';
import { CreateDaysopenDto } from './dto/create-daysopen.dto';
import { UpdateDaysopenDto } from './dto/update-daysopen.dto';

@Controller('daysopen')
export class DaysopenController {
  constructor(private readonly daysopenService: DaysopenService) {}

  @Post()
  create(@Body() createDaysopenDto: CreateDaysopenDto) {
    return this.daysopenService.create(createDaysopenDto);
  }
}
