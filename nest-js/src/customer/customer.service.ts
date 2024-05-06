import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from '../utils';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepo: Repository<Customer>,
    private jwtService: JwtService,
  ) {}
  
  async create(customerDto: CustomerDto) {
    const { email, name, surname, password } = customerDto;

    // Check if email is already registered
    const existingCustomer = await this.customerRepo.findOne({ where: { email } });
    if (existingCustomer) {
      throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
    }
    /*
    // Check if any of the required fields are missing
    if (!email || !name || !surname || !password || password != "") {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }*/

    // Hash the password
    const hashedPassword = await hashPassword(password);
    
    // Create the customer entity
    const customer = this.customerRepo.create({
      ...customerDto,
      password: hashedPassword
    });

    // Save the customer entity to the database
    const createdCustomer = await this.customerRepo.save(customer);

    return createdCustomer;
  }

  async findOne(id: number) {
    const customer = await this.customerRepo.findOne({where: {id}});
    if(!customer) {
      throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
    }
    return customer
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
