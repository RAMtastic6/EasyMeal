import Link from 'next/link';
import { LoginLogout } from './dynamic_login';
import { Navbar } from './nav_bar';

export default function Header({ login }: { login: boolean}) {
	return (
		<header className="bg-orange-500">
			<div className="mx-auto max-w-screen-xxl px-4 sm:px-6 lg:px-8">
				<div className="flex h-16 items-center justify-between">
					<div className="md:flex md:items-center md:gap-12">
						<Link className="block text-white font-bold" href="/create_reservation" data-testid={"HomeLink"}> EasyMeal </Link>
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
							<Navbar />
							<LoginLogout isLogin={login} />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}