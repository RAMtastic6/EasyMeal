'use client';
import { createSession } from "../lib/session";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function login() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const router = useRouter();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const result = await createSession(email, password);
		console.log(result);
		if(result)
			router.push('/create_reservation');
		else
			setError('Credenziali non corrette.');
	}

	return (
		<>
			<div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-color-white">
				<div className="sm:mx-auto sm:w-full sm:max-w-sm">
					<h1
						className="text-center text-2xl font-bold text-white mx-auto h-10 w-auto"
					> EasyMeal </h1>
					<div className="container mx-auto bg-white mt-4 p-10 rounded-md border">
						<h2 className="text-center text-xl font-bold leading-9 tracking-tight text-red-950">
							Accedi al tuo account
						</h2>

						<div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
							<form className="space-y-6" action="#" method="POST" onSubmit={handleLogin}>
								<div>
									<label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900 sr-only">
										Email address
									</label>
									<div className="mt-2">
										<input
											id="email"
											name="email"
											//type="email"
											autoComplete="email"
											placeholder="Indirizzo email..."
											data-testid={"InputEmail"}
											required
											onChange={(e) => setEmail(e.target.value)}
											className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>

								<div>
									<div className="flex flex-row-reverse">
										<label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900 sr-only">
											Password
										</label>
										<div className="text-sm">
											<a href="#" className="font-semibold text-red-950 align-right hover:text-white underline">
												Password dimenticata?
											</a>
										</div>
									</div>
									<div className="mt-2">
										<input
											id="password"
											name="password"
											type="password"
											autoComplete="current-password"
											placeholder="Password..."
											data-testid={"InputPassword"}
											required
											onChange={(e) => setPassword(e.target.value)}
											className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
										/>
									</div>
								</div>

								<div>
									<button
										type="submit"
										className="flex w-full justify-center rounded bg-orange-950 px-12 py-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring"
										data-testid={"LoginButton"}
									>
										Login
									</button>

								</div>
							</form>
							{error && <p className="mt-4 text-center text-red-500">{error}</p>}
							<p className="mt-10 text-center text-sm text-gray-500">
								Non sei ancora registrato?{' '}
								<a href="../sign_up" className="font-semibold leading-6 text-red-950 hover:text-white underline" data-testid={"LinkRegister"}>
									Registrati qui
								</a>
							</p>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
