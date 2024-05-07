import { Orders } from "../../orders/entities/order.entity";
import { Reservation } from "../../reservation/entities/reservation.entity";
import { ReservationGruop } from "../../reservation/entities/reservation_group.enity";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user',
}

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

    @Column({ default: UserRole.USER })
    role: UserRole;

    @OneToMany(() => Orders, order => order.customer)
    orders: Orders[];

    @OneToMany(() => ReservationGruop, group => group.customer)
    reservation_group: ReservationGruop[];

    @ManyToMany(() => Reservation, reservation => reservation.customers)
    reservations: Reservation[];
}
