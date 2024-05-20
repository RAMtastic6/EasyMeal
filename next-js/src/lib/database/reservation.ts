"use server";
import { cookies } from "next/headers";
import { Endpoints } from "./endpoints";

export async function getReservation(): Promise<JSON> {
	const response = await fetch(Endpoints.reservation);
	if (!response.ok) {
		throw new Error('Error fetching reservations from the database');
	}
	const data = await response.json();
	return data;
}

export async function getReservationById(id: number) {
	const response = await fetch(`${Endpoints.reservation}${id}`, {
		method: "GET",
		cache: "no-cache",
	});
	if (!response.ok) {
		throw new Error('Error fetching reservation from the database');
	}
	const data = await response.json();
	return data;
}

//Get restaurant and menu from reservation id
export async function getMenuWithOrdersQuantityByIdReservation(id: number) {
	const response = await fetch(`${Endpoints.reservation}${id}/orders`, {
		method: "GET",
		cache: "no-cache",	
	});
	if (!response.ok) {
		throw new Error('Error fetching restaurant from the database');
	}
	const data = await response.json();
	return data;
}

export async function createReservation(reservation: {}): Promise<any> {
	const token = cookies().get('session')?.value;
	const response = await fetch(Endpoints.reservation, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			...reservation,
			token
		}),
	});
	return {
		body: await response.json(),
		status: response.ok,
	};
}

export async function getReservationsByRestaurantId(restaurantId: number): Promise<[]> {
	const response = await fetch(`${Endpoints.reservation}restaurant/${restaurantId}`, {
		method: "GET",
		cache: "no-cache",
	});
	if (!response.ok) {
		throw new Error('Error fetching reservations from the database');
	}
	const data = await response.json();
	return data;
}

/* FUNZIONI ADMIN */

export async function acceptReservation(id: number): Promise<any> {
	const response = await fetch(`${Endpoints.reservation}${id}/accept`, {
		method: "POST",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
		},
	});
	return {
		body: await response.json(),
		status: response.ok,
	};
}

export async function rejectReservation(id: number): Promise<any> {
	const response = await fetch(`${Endpoints.reservation}${id}/reject`, {
		method: "POST",
		cache: "no-cache",
		headers: {
			"Content-Type": "application/json",
		},
	});
	return {
		body: await response.json(),
		status: response.ok,
	};
}
