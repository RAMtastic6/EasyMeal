import { Ingredient } from "../../food/entities/ingredient.entity";
import { OrderIngredients } from "../entities/order_ingredients";

export class OrderDto {
    reservation_id: number;
    food_id: number;
    quantity: number;
    ingredients: OrderIngredients[];
}
