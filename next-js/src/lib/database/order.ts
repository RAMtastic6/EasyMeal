import { Endpoints } from "./endpoints";

export async function getOrderByReservationId(id: number) {
    const res = await fetch(Endpoints.order + '/reservation/' + id.toString());
    const data = await res.json();
    return data;
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
