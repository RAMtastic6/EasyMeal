import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './entities/customer.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CustomerController],
  providers: [CustomerService],
  imports: [
    TypeOrmModule.forFeature([Customer]),
    //TODO: definire la firma del token
    JwtModule.register({
      secret: 'sgroi',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  exports: [TypeOrmModule, CustomerService]
})
export class CustomerModule {}
