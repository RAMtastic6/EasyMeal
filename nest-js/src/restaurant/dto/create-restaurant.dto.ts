export class CreateRestaurantDto {
    id: number;
    name: string;
    address: string;
    city: string;
    cuisine: string;
    tables: number;
    email: string;
    phone_number: string;
    daysOpen: {
        monday: {
            opening: string;
            closing: string;
        };
        tuesday: {
            opening: string;
            closing: string;
        };
        wednesday: {
            opening: string;
            closing: string;
        };
        thursday: {
            opening: string;
            closing: string;
        };
        friday: {
            opening: string;
            closing: string;
        };
        saturday: {
            opening: string;
            closing: string;
        };
        sunday: {
            opening: string;
            closing: string;
        }
    }
}
