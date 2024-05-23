import { IsNotEmpty } from "class-validator";

export class FindOneDTO {
    @IsNotEmpty()
    user_id: number;

    @IsNotEmpty()
    reservation_id: number;

    @IsNotEmpty()
    food_id: number;
}