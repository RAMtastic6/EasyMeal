import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

export enum Day {
    SUNDAY = 0,
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6
}

@Entity()
export class Daysopen {

    @PrimaryColumn({ name: 'restaurant_id' })
    restaurantId: number;

    @PrimaryColumn({ name: 'day_open', enum: Day, type: 'enum' })
    dayOpen: Day;

    @PrimaryColumn({ name: 'opening', type: 'time' })
    opening: string;

    @Column({ name: 'closing', type: 'time' })
    closing: string;

    @ManyToOne(() => Restaurant, ristorante => ristorante.daysOpen)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;
}