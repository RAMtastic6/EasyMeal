"use client";
import Link from 'next/link';
import { deleteSession } from '../lib/session';

export default function Header({ isLogin, isAdmin }: { isLogin: boolean, isAdmin: boolean }) {
	return (
		<header className="bg-orange-500">
			<div className="mx-auto max-w-screen-xxl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="md:flex md:items-center md:gap-12">
						<Link className="block text-white font-bold" href="/" data-testid={"HomeLink"}> EasyMeal </Link>
					</div>

					<div className="flex items-center gap-4">
						<div className="flex sm:gap-4">
							<Link href="/notifications">
								<div className="absolute inline-block rounded-full bg-red-700 p-2.5"></div>
								<span className="[&>svg]:h-10 [&>svg]:w-10">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 -2 26 26"
										fill="white">
										<path
											fillRule="evenodd"
											d="M5.25 9a6.75 6.75 0 0 1 13.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 0 1-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 1 1-7.48 0 24.585 24.585 0 0 1-4.831-1.244.75.75 0 0 1-.298-1.205A8.217 8.217 0 0 0 5.25 9.75V9Zm4.502 8.9a2.25 2.25 0 1 0 4.496 0 25.057 25.057 0 0 1-4.496 0Z"
											clipRule="evenodd" />
									</svg>
								</span>
							</Link>
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
						</div>
					</div>
				</div>
				<div className="mt-4 flex items-center justify-center space-x-4 border-t-2 border-black px-4 py-2 hidden md:block"> {/* Aggiunta del padding ai lati */}
							<Link className="text-white font-medium hover:text-gray-800 text-lg underline" href="/" data-testid="home-link">Home</Link>
							<Link className="text-white font-medium hover:text-gray-800 text-lg underline" href="/create_reservation" data-testid="create-reservation-link">Crea prenotazione</Link> 
							{isAdmin && (
								<Link
									href="/admin/reservations_list"
									className="text-white font-medium hover:text-gray-800 text-lg underline"
									data-testid="admin-reservations-link"
								>
									Lista prenotazioni ristorante
								</Link>
							)} 
							{!isAdmin && (
								<Link
									href="/user/reservations_list"
									className="text-white font-medium hover:text-gray-800 text-lg underline"
									data-testid="user-reservations-link"
								>
									Lista prenotazioni utente
								</Link>
							)}
					
					
					
				</div>

				<div className="mt-4 flex items-center justify-center space-x-4 border-t-2 border-black px-4 py-2 block md:hidden text-xs"> {/* Aggiunta del padding ai lati */}
					<ul className="text-center list-none">
						<li>
							<Link className="text-white font-medium hover:text-gray-800 text-lg underline" href="/" data-testid="home-link">Home</Link>
						</li>
						<li>
							<Link className="text-white font-medium hover:text-gray-800 text-lg underline" href="/create_reservation" data-testid="create-reservation-link">Crea prenotazione</Link> 
						</li>
						<li>
							{isAdmin && (
								<Link
									href="/admin/reservations_list"
									className="text-white font-medium hover:text-gray-800 text-lg underline"
									data-testid="admin-reservations-link"
								>
									Lista prenotazioni ristorante
								</Link>
							)} 
							{!isAdmin && (
								<Link
									href="/user/reservations_list"
									className="text-white font-medium hover:text-gray-800 text-lg underline"
									data-testid="user-reservations-link"
								>
									Lista prenotazioni utente
								</Link>
							)}
						</li>
					</ul>
				</div>


			</div>
		</header>
	);
}