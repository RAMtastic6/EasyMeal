import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private jwtService: JwtService
  ) {}
  
  create(createCustomerDto: CreateCustomerDto) {
    return 'This action adds a new customer';
  }

  findAll() {
    return `This action returns all customer`;
  }

  async findOne(id: number) {
    const customer = await this.customerRepo.findOne({where: {id}});
    if(customer) {
      return customer;
    } else return false;
  }

  update(id: number, updateCustomerDto: UpdateCustomerDto) {
    return `This action updates a #${id} customer`;
  }

  remove(id: number) {
    return `This action removes a #${id} customer`;
  }

  async login(email: string, password: string) {
    const result = await this.customerRepo.findOne({where: {email, password}});
    console.log(result);
    if (!result) {
      return false;
    }
    const token = this.jwtService.sign({id: result.id, role: 'customer'});
    return {token: token, userName: result.name, role: 'customer'};
  }
}
