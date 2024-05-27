"use server";
import { cookies } from "next/headers";
import { Endpoints } from "./endpoints";
import { verifySession } from "../dal";
import exp from "constants";
import { redirect } from "next/dist/server/api-utils";

export async function getOrderByReservationId(id: number) {
	const res = await fetch(Endpoints.order + 'reservation/' + id, {
		method: 'GET',
		cache: 'no-cache',
	});
	if(res.status === 404) {
		return null;
	}
	const data = await res.json();
	// Riordiniamo i dati in modo che siano ordinati per categoria e aggiungiamo un campo booleano per la rimozione
	const sortedData: any = {};
	data.forEach((order: any) => {
		if (!sortedData[order.food.type]) {
			sortedData[order.food.type] = [];
		}
		sortedData[order.food.type].push(order);
	});
	return sortedData;
}

export async function getRomanBill(id: number) {
	const res = await fetch(Endpoints.order + '/romanBill', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ reservation_id: id })
	});
	const data = await res.json();
	return data;
}

export async function saveOrders(data: {
	reservation_id: number,
	food_id: number,
}) {
	const token = cookies().get('session')?.value;
	if(!token) {
		return false;
	}
	const request = await fetch(Endpoints.order + "create", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			...data,
			token: token,
		}),
	});
	const response = await request.json();
	return response;
}

export async function deleteOrders(data: {
	reservation_id: number,
	food_id: number,
}) {
	const token = cookies().get('session')?.value;
	if(!token) {
		return false;
	}
	const request = await fetch(Endpoints.order + "remove", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			...data,
			token: token,
		}),
	});
	const response = await request.json();
	return response;
}


export async function updateIngredientsOrder(data: {
	id: number
	ingredients: any[],
}) {
	const token = cookies().get('session')?.value;
	if(!token) {
		return false;
	}
	const request = await fetch(Endpoints.order + 'updateIngredients', {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			...data,
			token: token,
		}),
	});
	return await request.json();
}

export async function updateListOrders(data: any) {
	const token = cookies().get('session')?.value;
	if(!token) {
		return false;
	}
	// Togliamo la categoria dagli ordini
	const orders = Object.values(data.orders).reduce((acc: any[], category: any) => {
		acc.push(...category);
		return acc;
	}, []);
	const request = await fetch(Endpoints.order + 'updateListOrders', {
			method: 'POST',
			cache: 'no-cache',
			headers: {
					'Content-Type': 'application/json',
			},
			body: JSON.stringify({
					orders,
					reservation_id: data.reservation_id,
					token: token,
			}),
	});
	if(request.status !== 200) {
		console.log(request.status);
		return false; 
	}
	const result = await request.json();
	return result;
}

export async function getPartialBill(data: {
	customer_id: number,
	reservation_id: number,
}) {
	const request = await fetch(Endpoints.order + 'partialBill', {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	const result = await request.json();
	return result;
}

export async function getTotalBill(data: {
	reservation_id: number,
}) {
	const request = await fetch(Endpoints.order + 'totalBill', {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});
	const result = await request.json();
	return result;
}