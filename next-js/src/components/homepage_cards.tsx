'use client';
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function homePageCards() {
  const router = useRouter();

  const handleUserSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/sign_up');
  }
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/login');
  }
  const handleAdminSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push('/sign_up_admin')
  }

  return (
    <>
      <div className="flex flex-col md:flex-row justify-center">
        <div className="container mx-auto bg-white mt-4 p-10 rounded-md border" >
          <h3 className="text-center text-xl font-bold leading-9 tracking-tight text-red-950 mx-auto">
            Sei un utente?
          </h3>
          <form action="/sign_up" method="GET" onSubmit={handleUserSignUp}>
            <div>
              <button
                id="user-sign-up"
                name="user-sign-in"
                type="submit"
                className="flex w-2/3 justify-center rounded bg-orange-950 px-9 py-3 mb-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring mx-auto"
              >
              Sign-up
              </button>
            </div>
          </form>
          <h3 className="text-center text-xl font-bold leading-9 tracking-tight text-red-950">
            Ti sei già registrato?
          </h3>
          <form action="/login" method="GET" onSubmit={handleLogin}>
            <div>
              <button
                id="user-login"
                type="submit"
                className="flex w-2/3 justify-center rounded bg-orange-950 px-9 py-3 mb-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring mx-auto"
                >
                Login
              </button>
            </div>
          </form>
        </div>
        <div className="container mx-auto bg-white mt-4 p-10 rounded-md border">
          <h3 className="text-center text-xl font-bold leading-9 tracking-tight text-red-950">
            Sei un ristoratore?
          </h3>
          <form action="/sign_up_admin" method="GET" onSubmit={handleAdminSignUp}>
            <div>
              <button
                id="admin-sign-up"
                type="submit"
                className="flex w-2/3 justify-center rounded bg-orange-950 px-9 py-3 mb-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring mx-auto"
              >
              Sign-up
              </button>
            </div>
          </form>
          <h3 className="text-center text-xl font-bold leading-9 tracking-tight text-red-950">
            Ti sei già registrato?
          </h3>
          <form action="/login" method="GET" onSubmit={handleLogin}>
            <div>
              <button
                id="admin-login"
                type="submit"
                className="flex w-2/3 justify-center rounded bg-orange-950 px-9 py-3 mb-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring mx-auto"
              >
              Login
              </button>
            </div>
          </form>
          
        </div>
      </div>
    </>
  )
}
