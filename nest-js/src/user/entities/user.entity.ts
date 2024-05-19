import { Orders } from "../../orders/entities/order.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { Column, Entity, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Staff } from "../../staff/enities/staff.entity";
import { Notification } from "../../notification/entities/notification.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 30 })
    name: string;

    @Column({ type: 'varchar', length: 30 })
    surname: string;

    @Column({ type: 'varchar', length: 256 })
    email: string;

    @Column({ type: 'varchar', length: 256 })
    password: string;

    @OneToMany(() => Orders, order => order.customer)
    orders: Orders[];

    @ManyToMany(() => Reservation, reservation => reservation.users)
    reservations: Reservation[];

    @OneToOne(() => Staff, staff => staff.user)
    staff: Staff;

    @OneToOne(() => Notification, notification => notification.user)
    notification: Notification;
}
