import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from '../utils';
import { Transactional } from 'typeorm-transactional-cls-hooked';
import { RestaurantService } from '../restaurant/restaurant.service';
import { DaysopenService } from '../daysopen/daysopen.service';
import { StaffService } from '../staff/staff.service';
import { StaffRole } from '../staff/enities/staff.entity';
import { AdminDto } from './dto/create-admin.dto';
import { query } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly restaurantService: RestaurantService,
    private readonly dayService: DaysopenService,
    private readonly staffService: StaffService,
  ) { }

  @Transactional()
  async create_user(userDto: UserDto) {
    const { email, name, surname, password } = userDto;
    // Check if email is already registered
    const existingCustomer = await this.userRepo.findOne({ where: { email } });
    if (existingCustomer) {
      return null;
    }

    if (!email || !name || !surname || !password || password == "") {
      return null;
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the customer entity
    const user = this.userRepo.create({
      ...userDto,
      password: hashedPassword,
    });

    // Save the customer entity to the database
    const createdUser = await this.userRepo.save(user);
    return createdUser;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    return user
  }

  async findUserByEmail(email: string) {
    return await this.userRepo.findOne({ 
      where: { 
        email 
      },
      relations: {
        staff: true
      }
    });
  }

  @Transactional()
  async create_admin(data: AdminDto) {
    // Create transaction
    
    const user = await this.create_user({
      email: data.email,
      name: data.name,
      surname: data.surname,
      password: data.password
    });

    if (!user) {
      return null;
    }

    // Create the restaurant
    const restaurant = await this.restaurantService.create(data.restaurant)

    if (!restaurant) {
      return null;
    }
    // Create the staff
    const staff = await this.staffService.create({
      role: StaffRole.ADMIN,
      restaurant_id: restaurant.id,
      user_id: user.id
    })

    if (!staff) {
      return null;
    }
    // Create days open
    const daysOpen = await this.dayService.create({
      restaurant_id: restaurant.id,
      days_open: data.dayopen.days_open
    });

    if (!daysOpen) {
      return null;
    }

    return true;
  }
}

