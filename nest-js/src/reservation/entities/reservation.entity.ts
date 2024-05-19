import { Orders } from "src/orders/entities/order.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "src/user/entities/user.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";

export enum ReservationStatus {
    PENDING = 'pending',
    ACCEPTED = 'accept',
    REJECTED = 'reject',
    COMPLETED = 'completed',
    TO_PAY = 'to_pay',
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

    //TODO: change state
    @Column({ default: ReservationStatus.ACCEPTED })
    state: ReservationStatus;

    @OneToMany(() => Orders, order => order.reservation)
    orders: Orders[];

    @ManyToMany(() => User, customer => customer.reservations)
    @JoinTable()
    users: User[];

    @ManyToOne(() => Restaurant, restaurant => restaurant.reservations)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;
}
