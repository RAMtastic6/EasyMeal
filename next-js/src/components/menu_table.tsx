'use client';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MenuTable(
	{ menu, updateHandler, setMenu }: {
		menu: {
			id: number,
			name: string,
			price: number,
			description: string,
			foods: any[],
		},
		updateHandler: (name: string, menu: any) => void,
		setMenu: any
	},
) {
	const decreaseQuantity = (index: number) => {
		console.log(index);
		if (menu.foods[index].quantity > 0) {
			menu.foods[index].quantity -= 1;
			setMenu(menu);
			updateHandler('decrement', menu);
		}
	};

	const increaseQuantity = (index: number) => {
		menu.foods[index].quantity += 1;
		setMenu(menu);
		updateHandler('increment', menu);
	};

	const [selectedOption, setSelectedOption] = useState('AllaRomana');

	const handleOptionChange = (option: string) => {
		setSelectedOption(option);
	};

	console.log(menu);
	const price = menu.foods.reduce((acc, food) => acc + food.price * food.quantity, 0);

	return (
		<>
			<div className="overflow-x-auto">
				<table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
					<thead className="ltr:text-left">
						<tr>
							<th className="whitespace-nowrap py-5 text-2xl text-orange-950 text-start">Antipasti</th>
						</tr>
					</thead>

					<tbody className="divide-y divide-gray-200">
						{menu.foods.map((food) => ( // Render rows dynamically
							<tr key={food.id}>
								<td className="whitespace-nowrap px-4 py-2">
									<div className="flex place-content-center">
										<Image src="/caprese.png" alt="Immagine della caprese" width={75} height={75} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
									</div>
								</td>
								<td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">{food.name}</td>
								<td className="whitespace-nowrap px-4 py-2 text-gray-700">{food.price}€</td>
								{
									//TODO: aggiungere la descrizione del cibo
								}
								<td className="whitespace-nowrap px-4 py-2 text-gray-700">Mozzarella, pomodoro, olio EVO</td>
								<td className="whitespace-nowrap py-2 text-right">
									<div>
										<label htmlFor={`${food.id}`} className="sr-only">Quantity</label>

										<div className="inline-block items-center rounded border border-gray-200">
											<button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={() => decreaseQuantity(menu.foods.indexOf(food))}>
												-
											</button>

											<input
												type="number"
												id={`${food.id}`}
												value={food.quantity}
												className="h-10 w-8 border-transparent text-center [-moz-appearance:_textfield] sm:text-sm [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
												readOnly
											/>

											<button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={() => increaseQuantity(menu.foods.indexOf(food))}>
												+
											</button>
										</div>
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<span className="flex items-center mt-8">
				<span className="h-px flex-1 bg-orange-950"></span>
			</span>

			<div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
				<div className="mx-auto max-w-3xl">
					<header className="text-center">
						<h1 className="text-xl font-bold text-orange-950 sm:text-3xl">Il vostro ordine</h1>
					</header>

					<div className="mt-8">
						<div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
							<div className="w-screen max-w-lg space-y-4">
								<dl className="space-y-0.5 text-sm text-gray-700">
									<div className="flex justify-between">
										<dt>Totale</dt>
										<dd>€{price}</dd>
									</div>
								</dl>

								<div className="flex justify-between !text-base font-medium">
									<dt>La tua parte:</dt>
								</div>
								<div>
									<label
										htmlFor="AllaRomana"
										className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 ${selectedOption === 'AllaRomana' ? 'has-[:checked]:border-orange-700 has-[:checked]:ring-1 has-[:checked]:ring-orange-700' : ''}`}
										onClick={() => handleOptionChange('AllaRomana')}
									>
										<p className="text-gray-700">Alla romana</p>
										{/* <p className="text-gray-900">50€</p> */}
										<input
											type="radio"
											className="sr-only"
											id="AllaRomana"
											checked={selectedOption === 'AllaRomana'}
											onChange={() => handleOptionChange('AllaRomana')}
										/>
									</label>
								</div>

								<div>
									<label
										htmlFor="Ognuno"
										// className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 has-[:disabled]:border-black ${selectedOption === 'Ognuno' ? 'has-[:checked]:border-orange-700 has-[:checked]:ring-1 has-[:checked]:ring-orange-700' : ''}`}
										className={`flex items-center justify-between gap-4 rounded-lg bg-gray-100 p-4 text-sm font-medium shadow-sm`}
									// onClick={() => handleOptionChange('Ognuno')}
									>
										<p className="text-gray-700">Ognun per sé (Coming Soon)</p>
										{/* <p className="text-gray-900">35€</p> */}
										<input
											type="radio"
											className="sr-only"
											id="Ognuno"
											// checked={selectedOption === 'Ognuno'}
											// onChange={() => handleOptionChange('Ognuno')}
											disabled
										/>
									</label>
								</div>

								<div className="flex justify-end">
									<div className="sm:flex sm:gap-4">
										<Link className="inline-block rounded bg-orange-950 px-8 py-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring"
											href="#"> Checkout </Link>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
