import { User } from "../../user/entities/user.entity";
import { Food } from "src/menu/entities/food.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Restaurant } from "src/restaurant/entities/restaurant.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Ingredient } from "../../restaurant/entities/ingredient.entity";

@Entity({name: 'order_detail'})
export class Orders {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    customer_id: number;

    @Column()
    reservation_id: number;

    @Column()
    food_id: number;

    @Column({default: 1})
    quantity: number;

    @ManyToOne(() => User, customer => customer.orders)
    @JoinColumn({ name: 'customer_id' })
    customer: User;

    @ManyToOne(() => Reservation, reservation => reservation.orders)
    @JoinColumn({ name: 'reservation_id' })
    reservation: Reservation;

    @ManyToOne(() => Food, (food) => food.orders)
    @JoinColumn({ name: "food_id" })
    food: Food;

    @ManyToMany(() => Ingredient, (ingredient) => ingredient.foodIngredients)
    @JoinTable()
    ingredients: Ingredient[];
}
