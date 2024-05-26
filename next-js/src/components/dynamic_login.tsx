"use client";
import Link from "next/link";
import { deleteSession } from "../lib/session";

export function LoginLogout({ isLogin }: { isLogin: boolean }) {
  return (
    <>
      {!isLogin && <Link className="inline-block rounded bg-orange-950 px-4 py-4 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring"
        href="/login" data-testid={"LoginLink"}> Login </Link>}
      {isLogin && <button
        className="inline-block rounded bg-orange-950 px-4 py-4 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring"
        data-testid={"LogoutButton"}
        onClick={async () => {
          await deleteSession();
          window.location.replace("/login");
        }}
      >Logout</button>}
    </>
  );
}