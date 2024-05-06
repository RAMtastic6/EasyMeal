import 'server-only'
import { Endpoints } from "./endpoints";

export async function getCustomerById(id: number) {
  const response = await fetch(Endpoints.customer+id);
  if(response.status === 404) return null;
  return await response.json();
}

export async function createCustomer(data: any) {
  const response = await fetch(Endpoints.customer, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return await response.json();
}