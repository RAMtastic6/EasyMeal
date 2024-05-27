'use client';
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Endpoints } from '../lib/database/endpoints';
import { Socket, io } from 'socket.io-client';
import { getToken, verifySession } from '../lib/dal';
import { deleteOrders, saveOrders } from '../lib/database/order';
import PaymentMethod from './payment_method';

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

	const sendData = async (index: number, menu: any, add: boolean) => {
		// Al db inviamo l'aumento o la dimuzione di 1
		if (add) {
			await saveOrders({
				reservation_id: parseInt(params.number),
				food_id: menu.foods[index].id,
			});
		} else {
			await deleteOrders({
				reservation_id: parseInt(params.number),
				food_id: menu.foods[index].id,
			});
		}
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
		getToken().then((token) => {
			const soc = io(Endpoints.socket, {
				query: {
					id_prenotazione: params.number,
				},
				auth: {
					token: token,
				}
			});
			socket.current = soc;
			socket.current.on('onMessage', handleMessage);
		});
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
			sendData(index, newMenu, false);
			setMenu(newMenu);
			setPrice(newMenu.foods.reduce((acc, food) => acc + food.price * food.quantity, 0));
		}
	};

	const increaseQuantity = (index: number) => {
		const newMenu = { ...menu };
		newMenu.foods[index].quantity += 1;
		sendData(index, newMenu, true);
		setMenu(newMenu);
		setPrice(newMenu.foods.reduce((acc, food) => acc + food.price * food.quantity, 0));
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
								<button type="button" data-testid={`decrease_${food.id}`} className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={() => decreaseQuantity(index)}>
									-
								</button>
								<input
									type="text"
									value={food.quantity}
									className="h-10 w-8 border-transparent text-center sm:text-sm"
									data-testid={`display_${food.id}`}
									readOnly
								/>
								<button type="button" data-testid={`increase_${food.id}`} className="size-10 leading-10 text-gray-600 transition hover:opacity-75" onClick={() => increaseQuantity(index)}>
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
		</>

	);
}
