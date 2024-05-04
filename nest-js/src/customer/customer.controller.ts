import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, HttpCode } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const result = await this.customerService.findOne(+id);
    if(result == false) 
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    return result;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(+id, updateCustomerDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.customerService.remove(+id);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: {
    email: string,
    password: string
  }) {
    const result = await this.customerService.login(body.email, body.password);
    if(!result) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return result;
  }
}
