import { BadRequestException, Body, Controller, Post, Get, NotFoundException, Param, ParseIntPipe } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffDto } from './dto/create-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(@Body() staffDto: StaffDto) {
    const result = await this.staffService.create(staffDto);
    if(result == null) {
      throw new BadRequestException('Invalid staff');
    }
    return result;
  }

  @Get(':id/restaurant')
  async getRestaurantIdByAdminId(@Param('id', ParseIntPipe) restaurant_id: number) {
    const result = await this.staffService.getAdminByRestaurantId(restaurant_id);
    if (!result) {
      throw new NotFoundException('Restaurant not found');
    }
    return result;
  }
}
