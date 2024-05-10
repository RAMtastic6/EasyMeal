import 'server-only';
import { Endpoints } from "./endpoints";

export async function getUserById(id: number) {
  const response = await fetch(Endpoints.user + id);
  if (response.status === 404) return null;
  return await response.json();
}

export async function createUser(data: any, role: string = "user") {
  const response = await fetch(Endpoints.user + role, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (response.status == 400) return null;
  return await response.json();
}

export async function login(email: string, password: string) {
  try {
    const response = await fetch(Endpoints.user + "login", {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (response.status != 200) {
      return null;
    }
    return (await response.json()).token;
  } catch (error) {
    //TODO: Handle error
    console.log('Error:', error);
    return null;
  }
}