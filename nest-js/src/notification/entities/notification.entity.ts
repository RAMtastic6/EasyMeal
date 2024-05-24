import { last } from "rxjs";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";

export enum NotificationStatus {
  READ = 'read',
  UNREAD = 'unread'
}

@Entity()
export class Notification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  message: string;

  @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.UNREAD })
  status: NotificationStatus;

  @Column()
  title: string

  @Column()
  id_receiver: number

  @ManyToOne(() => User, user => user.notification)
  @JoinColumn({ name: 'id_receiver' })
  user: User
}