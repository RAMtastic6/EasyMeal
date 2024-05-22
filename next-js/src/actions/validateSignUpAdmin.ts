'use server'
import { createAdmin } from "../lib/database/user"
import { getFormData } from "@/src/lib/utils"
import { Day, DaySchedule, daysOfWeek } from "@/src/lib/types/definitions"

export async function validateSignUpAdmin(prevState: any, formData: FormData) {
  //TODO: validate the form data
  console.log('validateSignUpAdmin', formData);
  // Get the form data
  const data = getFormData([
    'email',
    'nome',
    'cognome',
    'nome-ristorante',
    'city',
    'indirizzo',
    'descrizione',
    ...daysOfWeek.map(day => `${day}-isOpen`),
    ...daysOfWeek.map(day => `${day}-apertura`),
    ...daysOfWeek.map(day => `${day}-chiusura`),
    'coperti',
    'numero',
    'email-ristorante',
    'cucina',
    'password',
    'password_confirmation',
  ], formData);
  console.log('data', data);
  
  if (!data['email'] || !String(data['email']).includes('@')) return { message: 'Email must be valid' };
  if (!data['nome']) return { message: 'First name is required' };
  if (!data['cognome']) return { message: 'Last name is required' };
  if (!data['nome-ristorante']) return { message: 'Restaurant name is required' };
  if (!data['city']) return { message: 'City is required' };
  if (!data['indirizzo']) return { message: 'Address is required' };
  if (!data['coperti']) return { message: 'Number of seats is required' };
  if (!data['numero']) return { message: 'Phone number is required' };
  if (!data['email-ristorante']) return { message: 'Restaurant email is required' };
  if (!data['cucina']) return { message: 'Cuisine is required' };
  if (!data['password']) return { message: 'Password is required' };
  if (!data['password_confirmation']) return { message: 'Password confirmation is required' };
  if (String(data['password']) !== String(data['password_confirmation'])) return { message: 'Passwords do not match' };
  
  // Get the days open
  const daysOpenData = daysOfWeek.map((day: Day, index: number) => {
    console.log('day', day);
    const isOpen = data[`${day}-isOpen`] === 'on';
    console.log('day', data[`${day}-isOpen`]);
    console.log('day', data[`${day}-apertura`]);
    console.log('day', data[`${day}-chiusura`]);

    console.log('isOpen', day, isOpen);
    const opening = data[`${day}-apertura`];
    const closing = data[`${day}-chiusura`];
    if (isOpen ) {
      return {
        day_open: index,
        opening: isOpen ? opening : null,
        closing: isOpen ? closing : null,
      }
    }
    return null;
  });
  console.log('daysOpenData', daysOpenData);

  const json = {
    email: data['email'],
    name: data['nome'],
    surname: data['cognome'],
    password: data['password'],
    restaurant: {
      name: data['nome-ristorante'],
      address: data['indirizzo'],
      city: data['city'],
      cuisine: data['cucina'],
      tables: parseInt(data['coperti']),
      phone_number: data['numero'],
      email: data['email-ristorante'],
      description: data['descrizione'],
    },
    staff: {
      role: 'admin',
    },
    dayopen: {
      days_open: daysOpenData.filter(day => day !== null),
    },
  };

  const result = await createAdmin(json);
  
  if (result == null) {
    return { message: 'Registration failed' }
  }
  return { message: 'Registration successful' }
  
}