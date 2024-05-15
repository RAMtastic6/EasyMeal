import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    TypeOrmModule.forFeature([
      User
    ]),
    //TODO: definire la firma del token
    JwtModule.register({
      secret: 'sgroi',
      signOptions: { 
        expiresIn: '1h', 
        algorithm: 'HS256'
      },
    })
  ],
  exports: [TypeOrmModule, UserService]
})
export class UserModule { }
