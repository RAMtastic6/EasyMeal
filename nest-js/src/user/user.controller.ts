import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode, BadRequestException, NotFoundException, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { AdminDto } from './dto/create-admin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('user')
  async create(@Body() createCustomerDto: UserDto) {
    const result = await this.userService.create_user(createCustomerDto);
    if (result == null) {
      throw new BadRequestException('Invalid user');
    }
    return result;
  }

  @Post('admin')
  async createAdmin(@Body() createCustomerDto: AdminDto) {
    const result = await this.userService.create_admin(createCustomerDto);
    if (result == null) {
      throw new BadRequestException('Invalid user');
    }
    return result;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const result = await this.userService.findOne(id);
    if (result == null) {
      throw new NotFoundException('User not found with id: ' + id);
    }
    return result;
  }
}
