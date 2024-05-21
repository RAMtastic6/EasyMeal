import { Food } from 'src/food/entities/food.entity'

export class CreateRestaurantDto {
    id: number;
    name: string;
    address: string;
    city: string;
    cuisine: string;
    tables: number;
    email: string;
    phone_number: string;
}
