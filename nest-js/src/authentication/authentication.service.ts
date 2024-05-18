import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthenticationDto } from './dto/authentication.dto';
import { UserService } from '../user/user.service';
import { comparePasswords } from '../utils';

@Injectable()
export class AuthenticationService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService
  ) { }

  async generateToken(payload: { id: number, role: string }) {
    return await this.jwtService.signAsync(payload);
  }

  async signinUser(dto: AuthenticationDto) {
    const user = await this.userService.findUserByEmail(dto.email);
    if (!user) return null;
    const compare = await comparePasswords(dto.password, user.password);
    if (!compare) {
      return null;
    }
    const role = user.staff ? user.staff.role : 'customer';
    return await this.generateToken({ id: user.id, role: role });
  }

  async verifyToken(accessToken: string) {
    let payload;
    try {
      payload = this.jwtService.verify(accessToken);
    } catch (e) {
      return null;
    }
    return {
      id: payload.id,
      role: payload.role,
    }
  }
}
