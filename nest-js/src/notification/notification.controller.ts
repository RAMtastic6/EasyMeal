import { Body, Controller, Get, HttpCode, ParseIntPipe, Post, UnauthorizedException } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { AuthenticationService } from '../authentication/authentication.service';
import { FindAllByUserIdDTO } from './dto/findAllByUserId.dto';
import { UpdateStatusDTO } from './dto/updateStatus.dto';

@Controller('notification')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly authenticationService: AuthenticationService
  ) {}

  @Post()
  @HttpCode(200)
  // body: { userId: number, token: string}
  async findAllByUserId(@Body() body: FindAllByUserIdDTO ) {
    const auth = await this.authenticationService.verifyToken(body.token);
    if (!auth) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.notificationService.findAllByUserId(body.userId);
  }

  @Post('update')
  @HttpCode(200)
  async updateStatus(@Body() body: UpdateStatusDTO ) {
    const auth = await this.authenticationService.verifyToken(body.token);
    if (!auth || auth.id !== body.notificationId) {
      throw new UnauthorizedException('Invalid token');
    }
    return await this.notificationService.updateStatus(body.notificationId);
  }
}
