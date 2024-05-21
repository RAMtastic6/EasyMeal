import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode, BadRequestException, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { FindOneParams } from './dto/find-one-params.dto';

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

  @Get(':id')
  async findOne(@Param() params: FindOneParams) {
    const id = params.id; 
    const result = await this.userService.findOne(+id);
    if (result == null) {
      throw new NotFoundException('User not found with id: ' + id);
    }
    return result;
  }
}
