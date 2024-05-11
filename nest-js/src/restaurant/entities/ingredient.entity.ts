import { Column, Entity, ManyToMany, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { Food } from "./food.entity";
import { Orders } from "../../orders/entities/order.entity";

@Entity()
export class Ingredient {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToMany(() => Food, food => food.ingredients)
  foods: Food[];

  @ManyToMany(() => Orders, order => order.ingredients)
  orders: Orders[];
}