import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) { }

  async create_user(userDto: UserDto) {
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
    });

    // Save the customer entity to the database
    const createdUser = await this.userRepo.save(user);
    return createdUser;
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
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
}

