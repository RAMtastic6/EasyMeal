import { Endpoints } from "./endpoints";

export type DaysopenDto = {
    days_open: {
        day_open: number;
        opening: string;
        closing: string;
    }[],
    restaurant_id: number;
}

export async function createDaysOpen(data: DaysopenDto): Promise<any> {
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