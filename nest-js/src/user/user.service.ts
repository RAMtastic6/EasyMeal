import { HttpException, HttpStatus, Inject, Injectable, Query } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { comparePasswords, hashPassword } from '../utils';
import { RestaurantService } from '../restaurant/restaurant.service';
import { DaysopenService } from '../daysopen/daysopen.service';
import { StaffService } from '../staff/staff.service';
import { StaffRole } from '../staff/enities/staff.entity';
import { AdminDto } from './dto/create-admin.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private readonly restaurantService: RestaurantService,
    private readonly dayService: DaysopenService,
    private readonly staffService: StaffService,
    private readonly dataSource: DataSource
  ) { }

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

  async create_user_manager(userDto: UserDto, manager: EntityManager) {
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
    const user = manager.create(User, {
      ...userDto,
      password: hashedPassword,
    });

    // Save the customer entity to the database
    const createdUser = await manager.save(user);
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

  async create_admin(data: AdminDto) {
    const query = this.dataSource.createQueryRunner();
    await query.connect();
    await query.startTransaction();
    let result = true;

    try {
      // Create transaction
      const user = await this.create_user_manager({
        email: data.email,
        name: data.name,
        surname: data.surname,
        password: data.password
      }, query.manager);

      // Create the restaurant
      const restaurant = await this.restaurantService.createManager(
        data.restaurant, query.manager
      );

      // Create the staff
      const staff = await this.staffService.create_manager({
        role: StaffRole.ADMIN,
        restaurant_id: restaurant.id,
        user_id: user.id
      }, query.manager);

      // Create days open
      const daysOpen = await this.dayService.create_manager({
        restaurant_id: restaurant.id,
        days_open: data.dayopen.days_open
      }, query.manager);

      await query.commitTransaction();
    } catch(e) {
      console.log(e)
      if(query.isTransactionActive)
        await query.rollbackTransaction();
      result = null;
    } finally {
      await query.release();
    }
    return result;
  }
}

