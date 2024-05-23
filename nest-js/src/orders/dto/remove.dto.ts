import { IsNotEmpty, IsJWT } from "class-validator"

export class RemoveDTO {

    @IsNotEmpty()
    reservation_id: number;

    @IsNotEmpty()
    food_id: number;

    @IsNotEmpty()
    @IsJWT()
    token: string;
}