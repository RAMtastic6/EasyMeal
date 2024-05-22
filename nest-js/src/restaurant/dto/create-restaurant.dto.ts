import { Food } from 'src/food/entities/food.entity'
import { IsNotEmpty, IsEmail, IsNumberString } from 'class-validator';

export class CreateRestaurantDto {
    @IsNotEmpty()
    id: number;

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    address: string;

    @IsNotEmpty()
    city: string;

    @IsNotEmpty()
    cuisine: string;

    @IsNotEmpty()
    tables: number;

    @IsEmail()
    email: string;

    @IsNumberString()
    phone_number: string;
}
