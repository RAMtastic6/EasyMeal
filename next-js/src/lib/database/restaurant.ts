import { Endpoints } from "./endpoints";

export interface RestaurantFilter {
    name: string;
    date: string;
    city: string;
    cuisine: string;
}

//Otteniamo i ristoranti filtrati
export async function getFilteredRestaurants(params: RestaurantFilter): Promise<[]> {
    //Inseriamo i parametri nella query string
    let filter = [];
    for (const key in params) {
        if (params[key as keyof RestaurantFilter] != "") {
            filter.push(`${key}=${params[key as keyof RestaurantFilter]}`);
        }
    }
    const response = await fetch(`${Endpoints.restaurant}filter?${filter.join('&')}`);
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
        throw new Error('Error fetching restaurant menu from the database');
    }
    const data = await response.json();
    return data;
}

//Get all the cuisines
export async function getCuisines(): Promise<JSON> {
    const response = await fetch(`${Endpoints.restaurant}cuisines`);
    if (!response.ok) {
        throw new Error('Error fetching cuisines from the database');
    }
    const data = await response.json();
    return data;
}

//Get all the cities
export async function getCities(): Promise<JSON> {
    const response = await fetch(`${Endpoints.restaurant}cities`);
    if (!response.ok) {
        throw new Error('Error fetching cities from the database');
    }
    const data = await response.json();
    return data;
}
