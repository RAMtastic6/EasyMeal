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
    return result;
  }

  async findAllByUserId(id: number) {
    return await this.notificationRepository.find({
      where: { id_receiver: id },
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
}
