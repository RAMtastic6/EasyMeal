"use server"
import Link from "next/link";
import { roleAdmin } from "../lib/dal";
import { cookies } from "next/headers";

export async function Navbar() {
  const isAdmin = await roleAdmin();
  const isLogged = cookies().get("session")?.value != null;
  return (
    <>
      {isLogged && isAdmin && <Link href="/admin/reservations_list"
        className="inline-block rounded bg-orange-950 px-4 py-4 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring">
        Lista prenotazioni ristorante</Link>}
      {isLogged && !isAdmin && <Link href="/user/reservations_list"
        className="inline-block rounded bg-orange-950 px-4 py-4 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring">
        Lista prenotazioni utente</Link>}
    </>
  );
}