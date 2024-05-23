'use server';
import { Endpoints } from "./endpoints";

export async function createStaff(staff: any) {
	console.log(staff);
	const response = await fetch(Endpoints.staff, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(staff),
	});
	if (!response.ok) {
		throw new Error('Error creating staff: ' + await response.text());
	}
	const data = await response.json();
	return data;
}

export async function getRestaurantIdByAdminId(restaurant_id: number) {
	const response = await fetch(`${Endpoints.staff}${restaurant_id}/restaurant`, {
		method: 'GET',
		cache: 'no-cache',
	});
	if (!response.ok) {
		throw new Error('Error fetching restaurant id');
	}
	const data = await response.json();
	return data;
}