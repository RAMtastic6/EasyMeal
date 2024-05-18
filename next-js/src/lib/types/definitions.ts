// Definition of the types used in the application

export type Day = 'Lunedì' | 'Martedì' | 'Mercoledì' | 'Giovedì' | 'Venerdì' | 'Sabato' | 'Domenica';

export const daysOfWeek: Day[] = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

export interface DaySchedule {
  isOpen: boolean;
  hours: {
    open: string;
    close: string;
  };
}

// Definition of the types used to call the API

// DAYS OPEN
export interface DaysOpen {
  restaurant_id: number;
  days: {
    [key in Day]: DaySchedule;
  };
}

// STAFF
export interface Staff {
  restaurant_id: number;
  role: string;
  user_id: number;
}

// RESTAURANT
export interface Restaurant {
  name: string;
  address: string;
  city: string;
  cuisine: string;
  tables: number;
  email: string;
  phone_number: string;
}

// USER
export interface User {
  email: string;
  name: string;
  surname: string;
  password: string;
}