import { Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { Reservation } from "./reservation.entity";
import { Customer } from "src/customer/entities/customer.entity";

@Entity({ name: 'reservation_group' })
export class ReservationGruop {
    @PrimaryColumn()
    reservation_id: number;

    @PrimaryColumn()
    customer_id: number;

    @ManyToOne(() => Reservation, reservation => reservation.reservation_group, { cascade: true })
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;

    @ManyToOne(() => Customer, customer => customer.reservation_group, { cascade: true })
    @JoinColumn({ name: 'customer_id' })
    customer: Customer;
}