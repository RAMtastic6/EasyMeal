"use server"
import { Endpoints } from "./endpoints";

export async function getMenuByRestaurantId(id: number) {
    const response = await fetch(`${Endpoints.restaurant}${id}/menu`, {cache: "no-cache"});
    if (!response.ok) {
        throw new Error('Error fetching menu from the database');
    }
    const data = await response.json();
    return data;
}