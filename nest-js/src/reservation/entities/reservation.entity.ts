import { Orders } from "src/orders/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReservationGruop as ReservationGroup } from "./reservation_group.enity";
import { User } from "src/user/entities/user.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";

export enum ReservationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accept',
    REJECTED = 'reject',
}

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'timestamp without time zone' })
    date: Date;

    @Column()
    number_people: number;

    @Column()
    restaurant_id: number;

    @Column({ default: ReservationStatus.PENDING })
    state: ReservationStatus;

    @OneToMany(() => Orders, order => order.reservation)
    orders: Orders[];

    @OneToMany(() => ReservationGroup, group => group.reservation)
    reservation_group: ReservationGroup[];

    @ManyToMany(() => User, customer => customer.reservations)
    customers: User[];

    @ManyToOne(() => Restaurant, restaurant => restaurant.reservations)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;
}
