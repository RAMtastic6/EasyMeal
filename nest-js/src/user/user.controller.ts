import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('user')
  async create(@Body() createCustomerDto: UserDto) {
    const result = await this.userService.create_user(createCustomerDto);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.userService.findOne(+id);
    return result;
  }
}
