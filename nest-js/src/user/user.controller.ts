import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { UserDto } from './dto/create-user.dto';
import { AdminDto } from './dto/create-admin.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post('user')
  async create(@Body() createCustomerDto: UserDto) {
    const result = await this.userService.create_user(createCustomerDto);
    return result;
  }

  @Post('admin')
  async createAdmin(@Body() createAdminDto: AdminDto) {
    const result = await this.userService.create_admin(createAdminDto);
    return result;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.userService.findOne(+id);
    return result;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: {
    email: string,
    password: string
  }) {
    const result = await this.userService.login(body.email, body.password);
    if (!result) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return result;
  }
}
