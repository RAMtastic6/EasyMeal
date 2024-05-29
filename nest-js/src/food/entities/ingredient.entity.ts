import { Column, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Food } from "./food.entity";
import { Order } from "../../orders/entities/order.entity";
import { OrderIngredients } from "../../orders/entities/order_ingredients";

@Entity()
export class Ingredient {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => Food, food => food.ingredients)
  foods: Food[];

  @OneToMany(() => OrderIngredients, orderIngredients => orderIngredients.ingredient)
  orders: OrderIngredients[];
}