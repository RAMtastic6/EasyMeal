import { Body, Controller, Post } from '@nestjs/common';
import { NotificationGateway } from './notificationGateway';

@Controller('notification')
export class NotificationController {

    constructor(private notificationGateway: NotificationGateway) {}

    @Post('send')
    getNotification(@Body() body: any): string {
        // do some shit.
        this.notificationGateway.emitAll();
        return "this controller received" + body;
    }
}
