import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";

export enum Days {
    SUNDAY = 'domenica',
    MONDAY = 'lunedì',
    TUESDAY = 'martedì',
    WEDNESDAY = 'mercoledì',
    THURSDAY = 'giovedì',
    FRIDAY = 'venerdì',
    SATURDAY = 'sabato',
}

@Entity()
export class Day {

    @PrimaryColumn({ name: 'restaurant_id' })
    restaurantId: number;

    @PrimaryColumn({ name: 'day_open', enum: Days, type: 'enum' })
    dayOpen: Days;

    @PrimaryColumn({ name: 'opening', type: 'time' })
    opening: string;

    @Column({ name: 'closing', type: 'time' })
    closing: string;

    @ManyToOne(() => Restaurant, ristorante => ristorante.daysOpen)
    @JoinColumn({ name: 'restaurant_id' })
    restaurant: Restaurant;
}
