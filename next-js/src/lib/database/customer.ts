import { Endpoints } from "./endpoints";

export async function getCustomerById(id: number) {
  const response = await fetch(Endpoints.customer+id);
  if(response.status === 404) return null;
  return await response.json();
}