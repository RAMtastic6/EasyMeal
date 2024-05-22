import { Food } from "src/food/entities/food.entity";
import { IsNotEmpty } from "class-validator";

export class CreateMenuDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  foods: Food[];

  @IsNotEmpty()
  restaurant_id: number;
}