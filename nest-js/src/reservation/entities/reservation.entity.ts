import { Orders } from "src/orders/entities/order.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ReservationGruop as ReservationGroup } from "./reservation_group.enity";
import { Customer } from "src/customer/entities/customer.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";

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

    @Column({ default: true })
    pending: boolean;

    @OneToMany(() => Orders, order => order.reservation)
    orders: Orders[];

    @OneToMany(() => ReservationGroup, group => group.reservation)
    reservation_group: ReservationGroup[];

    @ManyToMany(() => Customer, customer => customer.reservations)
    customers: Customer[];

    @ManyToOne(() => Restaurant, restaurant => restaurant.reservations)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;
}
