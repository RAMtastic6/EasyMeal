import { PartialType } from '@nestjs/mapped-types';
import { CustomerDto } from './create-customer.dto';

export class UpdateCustomerDto extends PartialType(CustomerDto) { }
