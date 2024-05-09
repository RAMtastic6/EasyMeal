import { Food } from "src/reservation/entities/food.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Menu {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({type: "varchar", length: 100})
    name: string;

    @OneToMany(() => Food, food => food.menu)
    foods: Food[];

    @OneToOne(() => Restaurant, restaurant => restaurant.menu)
    restaurant: Restaurant;
}
