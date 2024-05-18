// Definition of the types used in the application

export type Day = 'lunedi' | 'martedi' | 'mercoledi' | 'giovedi' | 'venerdi' | 'sabato' | 'domenica';

export const daysOfWeek: Day[] = ['domenica', 'lunedi', 'martedi', 'mercoledi', 'giovedi', 'venerdi', 'sabato'];

export interface DaySchedule {
  isOpen: boolean;
  hours: {
    open: string;
    close: string;
  };
}

// Definition of the types used to call the API

// DAYS OPEN
export interface CreateDaysOpen {
  restaurant_id: number;
  days_open: {
    day_open: Day;
    opening: string;
    closing: string;
  }[];
}

export interface DaysOpen {
  restaurant_id: number;
  day_open: Day;
  opening: string;
  closing: string;
}

// STAFF
export interface Staff {
  role: string;
  restaurant_id: number;
  user_id: number;
}

// RESTAURANT
export interface Restaurant {
  name: string;
  address: string;
  city: string;
  cuisine: string;
  menu_id: number | null;
  tables: number;
  phone_number: string;
  email: string;
  image: string | null;
  description: string | null;
}

// USER
export interface User {
  name: string;
  surname: string;
  email: string;
  password: string;
}