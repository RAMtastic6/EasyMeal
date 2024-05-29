"use server"
import { Endpoints } from "./endpoints";

export async function getMenuByRestaurantId(id: number) {
    const response = await fetch(`${Endpoints.restaurant}${id}/menu`, {cache: "no-cache"});
    if(!response.ok) {
        return null
    }
    const data = await response.json();
    return data;
}