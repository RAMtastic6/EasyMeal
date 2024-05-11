import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from '../utils';
import { AdminDto } from './dto/create-admin.dto';
import { RestaurantService } from '../restaurant/restaurant.service';
import { CreateRestaurantDto } from '../restaurant/dto/create-restaurant.dto';
import { StaffService } from '../staff/staff.service';
import { StaffRole } from '../staff/enities/staff.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @Inject(JwtService)
    private jwtService: JwtService,
    private readonly restaurantService: RestaurantService,
    private staffService: StaffService
  ) { }

  async create_user(userDto: UserDto, role: UserRole = UserRole.USER) {
    const { email, name, surname, password } = userDto;
    // Check if email is already registered
    const existingCustomer = await this.userRepo.findOne({ where: { email } });
    if (existingCustomer) {
      throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
    }

    if (!email || !name || !surname || !password || password == "") {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the customer entity
    const user = this.userRepo.create({
      ...userDto,
      password: hashedPassword,
      role
    });

    // Save the customer entity to the database
    const createdUser = await this.userRepo.save(user);
    return createdUser;
  }

  async create_admin(adminDto: AdminDto) {
    //check if the user can create an admin
    const { email, name, surname, password, restaurant_name, restaurant_address, restaurant_city, restaurant_cuisine, restaurant_tables, restaurant_phone_number, restaurant_email, restaurant_daysOpen, menu_id } = adminDto;

    // Check if email is already registered
    const existingAdmin = await this.userRepo.findOne({ where: { email: adminDto.email } });
    if (existingAdmin) {
      throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
    }

    // Create and save the user with role admin
    const user = await this.create_user(
      { email, name, surname, password }
      , UserRole.USER);

    // Create a restaurant for the admin
    const restaurant = await this.restaurantService.create({
      name: restaurant_name,
      address: restaurant_address,
      city: restaurant_city,
      cuisine: restaurant_cuisine,
      tables: restaurant_tables,
      email: restaurant_email,
      phone_number: restaurant_phone_number,
      daysOpen: restaurant_daysOpen,
      menu_id: menu_id
    } as CreateRestaurantDto);
    // Assign the restaurant to the admin

    await this.staffService.create({
      restaurant_id: restaurant.id,
      role: StaffRole.ADMIN,
      user_id: user.id
    });

    return user;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user
  }

  async login(email: string, password: string) {
    const result = await this.userRepo.findOne({ where: { email } });
    if (!result || (await comparePasswords(password, result.password)) == false) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const token = this.jwtService.sign({
      id: result.id,
      role: result.role,
    },
    );
    return { token: token, userName: result.name, role: result.role };
  }
}

