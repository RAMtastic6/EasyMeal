import { Ingredient } from "../../restaurant/entities/ingredient.entity";
import { OrderIngredients } from "../entities/order_ingredients";

export class CreateOrderDto {
    customer_id: number;
    reservation_id: number;
    food_id: number;
    quantity: number;
    ingredients: OrderIngredients[];
}
