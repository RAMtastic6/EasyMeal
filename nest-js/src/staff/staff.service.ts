import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff } from './enities/staff.entity';
import { Repository } from 'typeorm';
import { StaffDto } from './dto/create-staff.dto';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
  ) {}

  async create(staffDto: StaffDto) {
    //Check if the staff already exists
    const existingStaff = await this.staffRepo.findOne({ 
      where: { 
        restaurant_id: staffDto.restaurant_id,
        user_id: staffDto.user_id
      } 
    });
    if (existingStaff) {
      throw new HttpException('Staff already exists', HttpStatus.CONFLICT);
    }
    //Check if inputs are valid
    if (!staffDto.restaurant_id || !staffDto.user_id || !staffDto.role) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }
    const staff = this.staffRepo.create({...staffDto});
    return await this.staffRepo.save(staff);
  }
}
