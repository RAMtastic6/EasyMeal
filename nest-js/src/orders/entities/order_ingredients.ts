import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";
import { Ingredient } from "../../food/entities/ingredient.entity";

@Entity({name: 'order_ingredients'})
export class OrderIngredients {
  @PrimaryColumn()
  order_id: number;

  @PrimaryColumn()
  ingredient_id: number;

  @Column({default: false})
  removed: boolean;

  @ManyToOne(() => Order, order => order.ingredients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Ingredient, ingredient => ingredient.orders)
  @JoinColumn({ name: 'ingredient_id' })
  ingredient: Ingredient;
}
