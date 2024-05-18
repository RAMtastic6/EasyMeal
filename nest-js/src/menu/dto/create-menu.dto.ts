import { Food } from "src/food/entities/food.entity";

export class CreateMenuDto {
  name: string;
  foods: Food[];
  restaurant_id: number;
}