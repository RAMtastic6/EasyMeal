'use server'
import { createUser } from "../lib/database/user"
import { createRestaurant } from "../lib/database/restaurant"
import { createStaff } from "../lib/database/staff"
import { createDaysOpen } from "../lib/database/daysopen"
import { getFormData } from "@/src/lib/utils"

export async function validateSignUpAdmin(prevState: any, formData: FormData) {
  //TODO: validate the form data
  const days = ['lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato', 'domenica']

  // Get the form data
  const data = getFormData([
    'email',
    'nome',
    'cognome',
    'nome-ristorante',
    'città',
    ...days.map(day => `${day}-apertura`),
    ...days.map(day => `${day}-chiusura`),
    'coperti',
    'numero',
    'email-ristorante',
    'cucina',
    'password',
    'password_confirmation',
  ], formData);

  // Check if email is valid
  if (!data['email']) {
    return { message: 'Email is required' }
  }
  if (!String(data['email']).includes('@')) {
    return { message: 'Email must be valid' }
  }

  // Check if first name and last name are valid
  if (!data['nome']) {
    return { message: 'First name is required' }
  }
  if (!data['cognome']) {
    return { message: 'Last name is required' }
  }

  //Check if restaurant name is valid
  if (!data['nome-ristorante']) {
    return { message: 'Restaurant name is required' }
  }

  // Check if city is valid
  if (!data['città']) {
    return { message: 'City is required' }
  }

  // Check if opening and closing hours are valid
  for (const day of days) {
    const openingHour = data[`${day}-apertura`]
    const closingHour = data[`${day}-chiusura`]
    if (!openingHour) {
      return { message: `${day} opening hour is required` }
    }
    if (!closingHour) {
      return { message: `${day} closing hour is required` }
    }
    if (openingHour >= closingHour) {
      return { message: `${day} opening hour must be before closing hour` }
    }
  }

  // Check if number of seats is valid
  if (!data['coperti']) {
    return { message: 'Number of seats is required' }
  }

  // Check if phone number is valid
  if (!data['numero']) {
    return { message: 'Phone number is required' }
  }

  // Check if restaurant email is valid
  if (!data['email-ristorante']) {
    return { message: 'Restaurant email is required' }
  }

  // Check if cuisine is valid
  if (!data['cucina']) {
    return { message: 'Cuisine is required' }
  }

  // Check if password is valid
  if (!data['password']) {
    return { message: 'Password is required' }
  }

  // Check if password confirmation is valid
  if (!data['password_confirmation']) {
    return { message: 'Password confirmation is required' }
  }

  // Check if password and password confirmation match
  const password = formData.get('password')
  const confirmPassword = formData.get('password_confirmation')
  if (!password) {
    return { message: 'Password is required' }
  }
  if (!confirmPassword) {
    return { message: 'Password confirmation is required' }
  }
  if (String(password) !== String(confirmPassword)) {
    return { message: 'Passwords do not match' }
  }
  */
  // Create the user
  
  const user = await createUser({
    email: 'giga@chad',
    name: 'Giga',
    surname: 'Chad',
    password: 'password',
  })
  
  // Create the restaurant
  const restaurant = await createRestaurant({
    name: 'Ristorante gigachad',
    address: 'Via di prova 1',
    city: 'Roma',
    cuisine: 'Italiana',
    tables: 10,
    email: 'r@e',
    phone_number: '1234567890'
  })
  // Create the staff
  const staff = await createStaff({
    restaurant_id: restaurant.id,
    role: 'admin',
    user_id: user.id
  })
  //create days open
  const daysOpen = await createDaysOpen({
    restaurant_id: restaurant.id,
    days: [
      restaurant_opening_hours: {
      lunedì: {
        apertura: data['lunedì-apertura'],
        chiusura: data['lunedì-chiusura'],
      },
      martedì: {
        apertura: data['martedì-apertura'],
        chiusura: data['martedì-chiusura'],
      },
      mercoledì: {
        apertura: data['mercoledì-apertura'],
        chiusura: data['mercoledì-chiusura'],
      },
      giovedì: {
        apertura: data['giovedì-apertura'],
        chiusura: data['giovedì-chiusura'],
      },
      venerdì: {
        apertura: data['venerdì-apertura'],
        chiusura: data['venerdì-chiusura'],
      },
      sabato: {
        apertura: data['sabato-apertura'],
        chiusura: data['sabato-chiusura'],
      },
      domenica: {
        apertura: data['domenica-apertura'],
        chiusura: data['domenica-chiusura'],
      },
    ]
  })

  restaurant_opening_hours: {
    lunedì: {
      apertura: data['lunedì-apertura'],
      chiusura: data['lunedì-chiusura'],
    },
    martedì: {
      apertura: data['martedì-apertura'],
      chiusura: data['martedì-chiusura'],
    },
    mercoledì: {
      apertura: data['mercoledì-apertura'],
      chiusura: data['mercoledì-chiusura'],
    },
    giovedì: {
      apertura: data['giovedì-apertura'],
      chiusura: data['giovedì-chiusura'],
    },
    venerdì: {
      apertura: data['venerdì-apertura'],
      chiusura: data['venerdì-chiusura'],
    },
    sabato: {
      apertura: data['sabato-apertura'],
      chiusura: data['sabato-chiusura'],
    },
    domenica: {
      apertura: data['domenica-apertura'],
      chiusura: data['domenica-chiusura'],
    },

  if (!response) {
    return { message: 'Registration failed' }
  }
  return { message: 'Registration successful' }
}