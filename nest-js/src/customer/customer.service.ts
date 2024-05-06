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
  
  async create(createCustomerDto: CreateCustomerDto) {
    const { email, name, surname, password } = createCustomerDto;

    // Check if email is already registered
    const existingCustomer = await this.customerRepo.findOne({ where: { email } });
    if (existingCustomer) {
      throw new HttpException('Email already registered', HttpStatus.BAD_REQUEST);
    }

    if (email.length < 5 || name.length < 2 || surname.length < 2 || !password) {
      throw new HttpException('Invalid input', HttpStatus.BAD_REQUEST);
    }

    // Create the customer entity
    const customer = this.customerRepo.create(createCustomerDto);

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
