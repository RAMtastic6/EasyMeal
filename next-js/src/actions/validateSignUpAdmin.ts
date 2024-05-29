'use server'
import { AdminDto, createAdmin } from "../lib/database/user"
import { DaysopenDto } from "../lib/database/daysopen"
import { getFormData } from "@/src/lib/utils"
import { Day, daysOfWeek } from "@/src/lib/types/definitions"
import { redirect } from "next/navigation";

export async function validateSignUpAdmin(prevState: any, formData: FormData) {

  // Get the form data
  const data = getFormData([
    'email',
    'nome',
    'cognome',
    'nome-ristorante',
    'city',
    'indirizzo',
    'descrizione',
    'coperti',
    'numero',
    'email-ristorante',
    'cucina',
    'password',
    'password_confirmation',
  ], formData);
  
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
  /*const daysOpenData = daysOfWeek.map((day: Day, index: number) => {
    console.log('day', day);
    const isOpen = data[`${day}-isOpen`] === 'on';
    console.log('day', data[`${day}-isOpen`]);
    console.log('day', data[`${day}-apertura`]);
    console.log('day', data[`${day}-chiusura`]);

    console.log('isOpen', day, isOpen);
    const opening: string = data[`${day}-apertura`];
    const closing: string = data[`${day}-chiusura`];
    if (isOpen && opening && closing) {
      return {
        day_open: index,
        opening: opening,
        closing: closing,
      }
    }
    return null;
  });*/

  const daysOpenData: {
    day_open: number;
    opening: string;
    closing: string;
  }[] = [];
  daysOfWeek.forEach((day: Day, index: number) => {
    const isOpen = formData.get(`${day}-isOpen`) === 'on';
    const opening: string = formData.get(`${day}-apertura`) as string;
    const closing: string = formData.get(`${day}-chiusura`) as string;
    if (isOpen && opening && closing) {
      daysOpenData.push({
        day_open: index,
        opening: opening,
        closing: closing,
      });
    }
  });
  console.log('daysOpenData', daysOpenData);

  const json: AdminDto = {
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
      days_open: daysOpenData,
    },
  };

  const response = await createAdmin(json);
  
  if (!response.ok) {
    const data = await response.json();
    if(data.message && Array.isArray(data.message))
      return { message: data.message.join(', ') };
    if(data.message)
      return { message: data.message };
    return { message: 'Registration failed' };
  }
  redirect("login?signup=success");
}