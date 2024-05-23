import { Body, Controller, Post } from '@nestjs/common';
import { NotificationGateway } from './notificationGateway';
import { NotificationDto } from './dto/notification.dto';

@Controller('notification')
export class NotificationController {

    constructor(private notificationGateway: NotificationGateway) {}

    @Post('send')
    async getNotification(@Body() body: NotificationDto)  {
        await this.notificationGateway.emitAll(body);
    }
}
