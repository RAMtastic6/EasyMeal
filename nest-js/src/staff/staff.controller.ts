import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
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
}
