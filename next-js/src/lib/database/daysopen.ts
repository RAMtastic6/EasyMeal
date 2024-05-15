import { Endpoints } from "./endpoints";

export async function createDaysOpen(data: any): Promise<any> {
    const response = await fetch(Endpoints.daysopen, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    });
    console.log(response.status+' '+response.statusText+' '+response.text());
    if (!response.ok) {
        throw new Error('Error creating days open');
    }
    return response;
}