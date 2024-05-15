/*import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { Food } from "../../menu/entities/food.entity";
import { Ingredient } from "./ingredient.entity";

@Entity()
export class FoodIngredient {

  @PrimaryColumn({ name: "id_food" })
  foodId: number;

  @PrimaryColumn({ name: "id_ingredient" })
  ingredientId: number;

  @Column()
  quantity: number;

  @ManyToOne(() => Food, food => food.foodIngredients)
  @JoinColumn({ name: "id_food" })
  food: Food;

  @ManyToOne(() => Ingredient, ingredient => ingredient.foodIngredients)
  @JoinColumn({ name: "id_ingredient" })
  ingredient: Ingredient;
}*/