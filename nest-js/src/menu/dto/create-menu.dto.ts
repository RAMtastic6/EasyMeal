import { Food } from "src/menu/entities/food.entity";

export class CreateMenuDto {
  name: string;
  foods: Food[];
  restaurant_id: number;
}