import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationStatus } from './entities/notification.entity';
import { NotificationDto } from './dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: NotificationDto) {
    const notification = this.notificationRepository.create(dto);
    const result = await this.notificationRepository.save(notification);
    // Send notification to websocket
    const response = await fetch('http://socket:8000/notification/send', {
      method: 'POST',
      body: JSON.stringify({
        id: result.id,
        title: result.title,
        message: result.message,
        id_receiver: [result.id_receiver],
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return result;
  }

  async findAllByUserId(id: number) {
    return await this.notificationRepository.find({
      where: { id_receiver: id, status: NotificationStatus.UNREAD},
      select: { 
        id: true, 
        title: true, 
        message: true, 
        status: true
      }
    });
  }

  async updateStatus(idNotification: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id: idNotification },
    });
    if (!notification) {
      return null;
    }
    notification.status = NotificationStatus.READ;
    return await this.notificationRepository.save(notification);
  }

  async findOne(id: number) {
    return await this.notificationRepository.findOne({where: {id: id}});
  }
}
