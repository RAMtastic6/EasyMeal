"use server";
import { cookies } from "next/headers";
import { Endpoints } from "./endpoints";
import { verifySession } from "../dal";

export async function getOrderByReservationId(id: number) {
    const res = await fetch(Endpoints.order + 'reservation/' + id, {
        method: 'GET',
        cache: 'no-cache',
    });
    const data = await res.json();
    // Riordiniamo i dati per tipologia di piatto
    const sortedData = data.reduce((acc: any, order: any) => {
        if (acc[order.food.type]) {
            acc[order.food.type].push(order);
        } else {
            acc[order.food.type] = [order];
        }
        return acc;
    }, {});
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
    ingredients: any[],
}) {
    const request = await fetch(Endpoints.order, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return await request.json();
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
