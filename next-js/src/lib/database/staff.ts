'use server';
import { Endpoints } from "./endpoints";

export async function createStaff(staff: any) {
    const response = await fetch(Endpoints.staff, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(staff),
    });
    if (!response.ok) {
        throw new Error('Error creating staff');
    }
    const data = await response.json();
    return data;
}