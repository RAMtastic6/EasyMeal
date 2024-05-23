import { Ingredient } from "../../food/entities/ingredient.entity";
import { OrderIngredients } from "../entities/order_ingredients";
import { IsNotEmpty } from "class-validator";

export class OrderDto {
    @IsNotEmpty()
    reservation_id: number;

    @IsNotEmpty()
    food_id: number;

    @IsNotEmpty()
    quantity: number;
    ingredients: OrderIngredients[];
}
