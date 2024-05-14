import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserRole } from './entities/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords, hashPassword } from '../utils';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @Inject(JwtService)
    private jwtService: JwtService,
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

