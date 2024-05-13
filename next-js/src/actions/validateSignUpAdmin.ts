'use server'
import { createUser } from "../lib/database/user"
import { createRestaurant } from "../lib/database/restaurant"
import { createStaff } from "../lib/database/staff"

export async function validateSignUpAdmin(prevState: any, formData: FormData) {

  //TODO: validate the form data
  // Check if email is valid
  const email = formData.get('email')
  if (!email) {
    return { message: 'Email is required' }
  }
  if (!String(email).includes('@')) {
    return { message: 'Email must be valid' }
  }

  // Check if first name and last name are valid
  const firstName = formData.get('nome')
  const lastName = formData.get('cognome')
  if (!firstName) {
    return { message: 'First name is required' }
  }
  if (!lastName) {
    return { message: 'Last name is required' }
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
  /* OLD CODE
  // Create the customer
  const response = await createUser({ 
    role: 'admin',
    email: email, 
    name: firstName, 
    surname: lastName, 
    password: password,
    restaurant_phone_number: formData.get('numero'),
    restaurant_name: formData.get('Nome-Ristorante'),
    restaurant_city: formData.get('città'),
    restaurant_phone: formData.get('restaurant_phone'),
    restaurant_email: formData.get('restaurant_email'),
    restaurant_cuisine: formData.get('restaurant_cuisine'),
  })
  */  

  // Create the user
  const user = await createUser({ 
    email: email,
    name: firstName,
    surname: lastName,
    password: password
  })
  
  // Create the restaurant
  const restaurant = await createRestaurant({
    name: formData.get('Nome-Ristorante'),
    address: formData.get('indirizzo'),
    city: formData.get('città'),
    cuisine: formData.get('cucina'),
    tables: formData.get('coperti'),
    phone_number: formData.get('numero'),
    email: formData.get('mail'),
  })
  // Create the staff
  const staff = await createStaff({
    restaurant_id: restaurant.id,
    role: 'admin',
    user_id: 1
  })

  if (!user || !restaurant || !staff) {
    return { message: 'Registration failed' }
  }
  return { message: 'Registration successful' }
}