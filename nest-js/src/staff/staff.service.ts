import { Injectable } from '@nestjs/common';
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
    const staff = this.staffRepo.create({...staffDto});
    return await this.staffRepo.save(staff);
  }
}
