'use server';
import { Endpoints } from "./endpoints";

export interface RestaurantFilter {
    name: string;
    date: string;
    city: string;
    cuisine: string;
}

//Otteniamo i ristoranti filtrati
export async function getFilteredRestaurants(params: RestaurantFilter, currentPage: number, ITEMS_PER_PAGE: number): Promise<[]> {
    //Inseriamo i parametri nella query string
    let filter = [];
    for (const key in params) {
        if (params[key as keyof RestaurantFilter] != "") {
            filter.push(`${key}=${params[key as keyof RestaurantFilter]}`);
        }
    }
    const response = await fetch(`${Endpoints.restaurant}filter?currentPage=${currentPage}&ITEMS_PER_PAGE=${ITEMS_PER_PAGE}&${filter.join('&')}`);
    if (!response.ok) {
        throw new Error('Error fetching restaurants from the database');
    }
    const data = await response.json();
    return data;
}

//Get all the restaurants
export async function getRestaurants(): Promise<JSON> {
    const response = await fetch(Endpoints.restaurant);
    if (!response.ok) {
        throw new Error('Error fetching restaurants from the database');
    }
    const data = await response.json();
    return data;
}

//Get a restaurant by id
export async function getRestaurantById(id: number): Promise<any> {
    const response = await fetch(`${Endpoints.restaurant}${id}`);
    if (!response.ok) {
        throw new Error('Error fetching restaurant from the database');
    }
    const data = await response.json();
    return data;
}

export async function getRestaurantOrders(id: number) {
    const response = await fetch(`${Endpoints.reservation}${id}/orders`);
    if (!response.ok) {
        console.log(response.statusText);
        throw new Error('Error fetching restaurant menu from the database');
    }
    const data = await response.json();
    return data;
}

//Get all the cuisines
export async function getAllCuisines(): Promise<string[]> {
    //cacha la risposta per un ora
    const response = await fetch(`${Endpoints.restaurant}cuisines`, { next: { revalidate: 3600 } });
    if (!response.ok) {
        throw new Error('Error fetching cuisines from the database');
    }
    const data = await response.json();
    return data;
}

//Get all the cities
export async function getAllCities(): Promise<string[]> {
    const response = await fetch(`${Endpoints.restaurant}cities`, { next: { revalidate: 3600 } });
    if (!response.ok) {
        throw new Error('Error fetching cities from the database');
    }
    const data = await response.json();
    return data;
}