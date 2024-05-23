import 'server-only';
import { Endpoints } from "./endpoints";

export type AdminDto = {
  email: string;
  name: string;
  surname: string;
  password: string;
  restaurant: {
    name: string;
    address: string;
    city: string;
    cuisine: string;
    tables: number;
    phone_number: string;
    email: string;
    description: string;
  };
  staff: {
    role: string;
  };
  dayopen: {
    days_open: {
      day_open: number;
      opening: string;
      closing: string;
    }[];
  };
};

export async function getUserById(id: number) {
  const response = await fetch(Endpoints.user + id);
  if (response.status === 404) return null;
  return await response.json();
}

export async function createUser(data: {
  email: string, name: string, surname: string, password: string
}) {
  const response = await fetch(Endpoints.user+"user", {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
}

export async function createAdmin(data: AdminDto) {
  const response = await fetch(Endpoints.user+"admin", {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return response;
}

