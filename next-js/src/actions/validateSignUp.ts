'use server'
import { redirect } from "next/navigation"
import { createUser } from "../lib/database/user"

export async function validateSignUp(prevState:any, formData: FormData) {

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

    // Create the customer
    const response = await createUser({ email: email, name: firstName, surname: lastName, password: password })
    if (response !== 201) {
        return { message: 'Registration failed, credenziali non valide!' }
    }
    redirect('/login?signup=success')
}