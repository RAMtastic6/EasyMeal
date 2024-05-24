import { IsNotEmpty } from "class-validator";

export class CreateReservationDto {

    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    number_people: number;

    @IsNotEmpty()
    restaurant_id: number;

    @IsNotEmpty()
    token: string;
}