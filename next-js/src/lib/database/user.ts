import 'server-only';
import { Endpoints } from "./endpoints";

export async function getUserById(id: number) {
  const response = await fetch(Endpoints.user + id);
  if (response.status === 404) return null;
  return await response.json();
}

export async function createUser(data: any) {
  const response = await fetch(Endpoints.user+"user", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (response.status != 201) return null;
  return await response.json();
}

export async function createAdmin(data: any) {
  const response = await fetch(Endpoints.user+"admin", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (response.status != 201) return null;
  return await response.json();
}

