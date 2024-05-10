import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { FoodIngredient } from "./food_ingredient.entity";

@Entity()
export class Ingredient {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @OneToMany(() => FoodIngredient, foodIngredient => foodIngredient.ingredient)
  foodIngredients: FoodIngredient[];
}