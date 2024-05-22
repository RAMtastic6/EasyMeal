import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Staff, StaffRole } from './enities/staff.entity';
import { Repository } from 'typeorm';
import { StaffDto } from './dto/create-staff.dto';
import { Transactional } from 'typeorm-transactional-cls-hooked';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(Staff)
    private staffRepo: Repository<Staff>,
  ) {}

  @Transactional()
  async create(staffDto: StaffDto) {
    //Check if the staff already exists
    const existingStaff = await this.staffRepo.findOne({ 
      where: { 
        restaurant_id: staffDto.restaurant_id,
        user_id: staffDto.user_id
      } 
    });
    if (existingStaff) {
      return null;
    }
    //Check if inputs are valid
    if (!staffDto.restaurant_id || !staffDto.user_id || !staffDto.role) {
      return null;
    }
    const staff = this.staffRepo.create({...staffDto});
    return await this.staffRepo.save(staff);
  }

  async getAdminByRestaurantId(restaurant_id: number) {
    return await this.staffRepo.findOne({
      where: {
        restaurant_id: restaurant_id,
        role: StaffRole.ADMIN
      }
    });
  }

  async getRestaurantByAdminId(userId: number) {
    return await this.staffRepo.findOne({
      where: {
        user_id: userId,
        role: StaffRole.ADMIN
      }
    });
  }
}
