import { User } from "../../user/entities/user.entity";
import { Food } from "src/food/entities/food.entity";
import { Reservation } from "src/reservation/entities/reservation.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { OrderIngredients } from "./order_ingredients";

@Entity({ name: 'order_detail' })
export class Order {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	user_id: number;

	@Column()
	reservation_id: number;

	@Column()
	food_id: number;

	@Column({ default: 1 })
	quantity: number;

	@Column({ default: false })
	paid: boolean;

	@ManyToOne(() => User, customer => customer.orders)
	@JoinColumn({ name: 'customer_id' })
	customer: User;

	@ManyToOne(() => Reservation, reservation => reservation.orders)
	@JoinColumn({ name: 'reservation_id' })
	reservation: Reservation;

	@ManyToOne(() => Food, (food) => food.orders)
	@JoinColumn({ name: "food_id" })
	food: Food;

	@OneToMany(() => OrderIngredients, orderIngredient => orderIngredient.order)
	ingredients: OrderIngredients[];
}
