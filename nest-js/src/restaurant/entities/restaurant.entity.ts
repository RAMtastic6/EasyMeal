import { Menu } from "src/menu/entities/menu.entity";
import { Daysopen } from "src/daysopen/entities/daysopen.entity";
import { Orders } from "src/orders/entities/order.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Staff } from "../../staff/enities/staff.entity";

@Entity()
export class Restaurant {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 100})
    name: string;

    @Column({type: "varchar", length: 100})
    address: string;

    @Column({type: "varchar", length: 100})
    city: string;

    @Column({type: "varchar", length: 100})
    cuisine: string;

    @Column({nullable: true})
    menu_id: number;

    @Column()
    tables: number;

    @Column({type: "varchar", length: 20})
    phone_number: string;

    @Column({type: "varchar", length: 256})
    email: string;

    @Column({ type: "varchar", length: 255, nullable: true })
    image: string

    @Column({ type: "varchar", length: 255, nullable: true })
    description: string;

    @OneToOne(() => Menu, menu => menu.restaurant, {cascade: true, nullable: true})
    @JoinColumn({name: "menu_id"})
    menu: Menu;

    @OneToMany(() => Daysopen, daysopen => daysopen.restaurant)
    daysOpen: Daysopen[];

    @OneToMany(() => Reservation, reservation => reservation.restaurant)
    reservations: Reservation[];

    @OneToMany(() => Staff, staff => staff.restaurant)
    staff: Staff[];
}
