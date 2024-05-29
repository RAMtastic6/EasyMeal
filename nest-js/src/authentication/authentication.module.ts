import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';

@Module({
  controllers: [AuthenticationController],
  providers: [AuthenticationService],
  exports: [AuthenticationService],
  imports: [
    JwtModule.register({
      secret: 'sgroi',
      signOptions: { 
        expiresIn: '1h', 
        algorithm: 'HS256'
      },
    }),
    UserModule
  ]
})
export class AuthenticationModule {}
