import { IsNotEmpty } from "class-validator";

export class UpdateIngredientsDTO {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    ingredients: any[];
}