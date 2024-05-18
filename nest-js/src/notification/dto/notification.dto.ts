import { NotificationStatus } from "../entities/notification.entity";

export class NotificationDto {
  message: string;
  title: string;
  id_receiver: number;
}