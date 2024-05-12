"use server";
import { cookies } from "next/headers";
import { Endpoints } from "./endpoints";
import { verifySession } from "../dal";
import exp from "constants";

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
	quantity: number,
}) {
	const user = await verifySession();
	const request = await fetch(Endpoints.order + "createOrUpdate", {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			...data,
			customer_id: user.id,
		}),
	});
	const response = await request.json();
	return response;
}

export async function updateIngredientsOrder(data: {
	id: number
	ingredients: any[],
}) {
	const user = await verifySession();
	const request = await fetch(Endpoints.order + 'updateIngredients', {
		method: 'POST',
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			...data,
			customer_id: user.id,
		}),
	});
	return await request.json();
}

export async function updateListOrders(data: any) {
	const user = await verifySession();
	// Togliamo la categoria dagli ordini
	const orders = Object.values(data).reduce((acc: any[], category: any) => {
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
					customer_id: user.id,
			}),
	});
	const result = await request.json();
	return result;
}
