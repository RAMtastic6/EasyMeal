import { IsNotEmpty, IsJWT } from "class-validator"

export class AddQuantityDTO {

    @IsNotEmpty()
    @IsJWT()
    token: string;

    @IsNotEmpty()
    reservation_id: number;

    @IsNotEmpty()
    food_id: number;

    @IsNotEmpty()
    quantity: number;
}