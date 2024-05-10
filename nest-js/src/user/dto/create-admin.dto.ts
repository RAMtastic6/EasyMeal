export class AdminDto {
  name: string;
  surname: string;
  email: string;
  password: string;
  restaurant_name: string;
  restaurant_address: string;
  restaurant_city: string;
  restaurant_cuisine: string;
  restaurant_tables: number;
  restaurant_email: string;
  restaurant_phone_number: string;
  restaurant_daysOpen: {
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