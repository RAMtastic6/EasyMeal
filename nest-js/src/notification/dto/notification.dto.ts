import { NotificationStatus } from "../entities/notification.entity";
import { IsNotEmpty } from "class-validator";

export class NotificationDto {
  message: string;
  @IsNotEmpty()
  title: string;
  id_receiver: number;
}