import { User } from "../../user/entities/user.entity";
import { Food } from "src/reservation/entities/food.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'order_detail'})
export class Orders {
    @PrimaryColumn()
    customer_id: number;

    @PrimaryColumn()
    reservation_id: number;

    @PrimaryColumn()
    food_id: number;

    @Column({default: 1})
    quantity: number;

    @ManyToOne(() => Food, food => food.orders)
    @JoinColumn({ name: 'food_id' })
    food: Food;

    @ManyToOne(() => User, customer => customer.orders)
    @JoinColumn({ name: 'customer_id' })
    customer: User;

    @ManyToOne(() => Reservation, reservation => reservation.orders)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;
}
