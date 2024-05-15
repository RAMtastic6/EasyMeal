import { Food } from 'src/menu/entities/food.entity'
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
