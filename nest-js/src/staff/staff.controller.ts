import { Body, Controller, Get, NotFoundException, Post } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffDto } from './dto/create-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffService: StaffService) {}

  @Post()
  async create(@Body() staffDto: StaffDto) {
    return await this.staffService.create(staffDto);
  }

  @Get(':id/restaurant')
  async getRestaurantIdByAdminId(restaurant_id: number) {
    const result = await this.staffService.getAdminByRestaurantId(restaurant_id);
    if (!result) {
      throw new NotFoundException('Restaurant not found');
    }
    return result;
  }
}
