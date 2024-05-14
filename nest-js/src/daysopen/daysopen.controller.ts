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

  @Get()
  findAll() {
    return this.daysopenService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.daysopenService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDaysopenDto: UpdateDaysopenDto) {
    return this.daysopenService.update(+id, updateDaysopenDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.daysopenService.remove(+id);
  }
}
