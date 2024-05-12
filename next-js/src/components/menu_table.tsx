'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Endpoints } from '../lib/database/endpoints';
import { Socket, io } from 'socket.io-client';
import { verifySession } from '../lib/dal';
import { saveOrders } from '../lib/database/order';

export default function MenuTable(
	{ menuData, params }: {
		menuData: {
			id: number,
			name: string,
			price: number,
			description: string,
			foods: any[],
		},
		params: { number: string },
	},
) {
	const socket = useRef<Socket>();
	const [menu, setMenu] = useState(menuData);
	const [price, setPrice] = useState(menuData.foods.reduce((acc, food) => acc + food.price * food.quantity, 0));

	const sendData = async (index: number, menu: any, amount: number) => {
		// Al db inviamo l'aumento o la dimuzione di 1
		const result = await saveOrders({
			reservation_id: parseInt(params.number),
			food_id: menu.foods[index].id,
			quantity: amount,
		});
		// Al socket inviamo il dato aggiornato
		socket.current?.emit('onMessage', {
			id_prenotazione: params.number,
			data: {
				index: index,
				quantity: menu.foods[index].quantity,
			},
		});
	}

	const handleMessage = (body: any) => {
		const newMenu = { ...menu };
		newMenu.foods[body.index].quantity = body.quantity;
		setMenu(newMenu);
		setPrice(newMenu.foods.reduce((acc, food) => acc + food.price * food.quantity, 0));
	}

	useEffect(() => {
		const soc = io(Endpoints.socket + '?id_prenotazione=' + params.number);
		socket.current = soc;
		socket.current.on('onMessage', handleMessage);
		//Close the socket connection when the component is unmounted
		return () => {
			socket.current?.off('onMessage', handleMessage);
			socket.current?.disconnect();
		}
	}, []);

	const decreaseQuantity = (index: number) => {
		const newMenu = { ...menu };
		if (menu.foods[index].quantity > 0) {
			newMenu.foods[index].quantity -= 1;
			sendData(index, newMenu, -1);
			setMenu(newMenu);
			setPrice(newMenu.foods.reduce((acc, food) => acc + food.price * food.quantity, 0));
		}
	};

	const increaseQuantity = (index: number) => {
		const newMenu = { ...menu };
		newMenu.foods[index].quantity += 1;
		sendData(index, newMenu, +1);
		setMenu(newMenu);
		setPrice(newMenu.foods.reduce((acc, food) => acc + food.price * food.quantity, 0));
	};

	const [selectedOption, setSelectedOption] = useState('AllaRomana');

	const handleOptionChange = (option: string) => {
		setSelectedOption(option);
	};

	return (
		<>
			<div className="overflow-x-auto">
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
					{menu.foods.map((food, index) => (
						<div key={food.id} className="bg-white shadow-md p-4 rounded-lg">
							<div className="flex justify-center">
								<Image src="/caprese.png" alt="Immagine della caprese" width={75} height={75} className="w-20 h-20 object-cover" />
							</div>
							<div className="text-center mt-4">
								<h3 className="text-lg font-medium text-gray-900">{food.name}</h3>
								<p className="text-gray-700">{food.price}€</p>
								<p className="text-gray-700">{food.description}</p>
							</div>
							<div className="flex justify-center mt-4">
								<button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={() => decreaseQuantity(index)}>
									-
								</button>
								<input
									type="text"
									value={food.quantity}
									className="h-10 w-8 border-transparent text-center sm:text-sm"
									readOnly
								/>
								<button type="button" className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={() => increaseQuantity(index)}>
									+
								</button>
							</div>
							<div className="mt-4">
								<p className="text-gray-700 font-medium">Ingredienti:</p>
								<ul className="list-disc list-inside">
									{food.ingredients.map((ingredient: any, index: number) => (
										<li key={index} className="text-gray-700">{ingredient.name}</li>
									))}
								</ul>
							</div>
						</div>
					))}
				</div>
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
										className={`flex items-center justify-between gap-4 rounded-lg bg-gray-100 p-4 text-sm font-medium shadow-sm`}
									>
										<p className="text-gray-700">Ognun per sé (Coming Soon)</p>
										<input
											type="radio"
											className="sr-only"
											id="Ognuno"
											disabled
										/>
									</label>
								</div>

								<div className="flex justify-end">
									<div className="sm:flex sm:gap-4">
										<Link className="inline-block rounded bg-orange-950 px-8 py-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring" href={`${params.number}/checkout/`}> Checkout </Link>
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
