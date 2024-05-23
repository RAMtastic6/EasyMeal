'use server'
import { redirect } from "next/navigation"
import { createUser } from "../lib/database/user"

export async function validateSignUp(prevState: any, formData: FormData) {

	// Check if email is valid
	const email = formData.get('email')?.toString()
	if (!email) {
		return { message: 'Email is required' }
	}
	if (!String(email).includes('@')) {
		return { message: 'Email must be valid' }
	}

	// Check if first name and last name are valid
	const firstName = formData.get('nome')?.toString()
	const lastName = formData.get('cognome')?.toString()
	if (!firstName) {
		return { message: 'First name is required' }
	}
	if (!lastName) {
		return { message: 'Last name is required' }
	}

	// Check if password and password confirmation match
	const password = formData.get('password')?.toString()
	const confirmPassword = formData.get('password_confirmation')?.toString()
	if (!password) {
		return { message: 'Password is required' }
	}
	if (!confirmPassword) {
		return { message: 'Password confirmation is required' }
	}
	if (password !== confirmPassword) {
		return { message: 'Passwords do not match' }
	}

	// Create the customer
	const response = await createUser({ 
		email: email, name: firstName, surname: lastName, password: password 
	});

	if (!response.ok) {
		const data = await response.json();
		if (data.message && Array.isArray(data.message))
			return { message: data.message.join(', ') };
		if (data.message)
			return { message: data.message };
		return { message: 'Registration failed' };
	}
	redirect('/login?signup=success')
}