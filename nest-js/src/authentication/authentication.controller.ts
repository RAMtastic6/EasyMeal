import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationDto } from './dto/authentication.dto';
import { DecodeTokenDTO } from './dto/decodeToken.dto';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) { }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() dto: AuthenticationDto) {
    const result = await this.authenticationService.signinUser(dto);
    if (!result) throw new UnauthorizedException("User not found or password incorrect");
    return {
      token: result
    };
  }

  @Post('decodeToken')
  @HttpCode(200)
  async decodeToken(@Body() body: DecodeTokenDTO) {
    const token = body.token;
    if (!token) throw new UnauthorizedException("Token is missing");
    const result = await this.authenticationService.verifyToken(token);
    if (!result) throw new UnauthorizedException("Unauthorized");
    return result;
  }
}
