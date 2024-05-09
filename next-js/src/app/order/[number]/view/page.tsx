'use client';
import MenuTable from '@/src/components/menu_table';
import Header from '@/src/components/header';
import { getMenuWithOrdersQuantityByIdReservation } from '../../../../lib/database/reservation';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { number: string } }) {

	const [data, setData] = useState<any>();

	useEffect(() => {
		getMenuWithOrdersQuantityByIdReservation(parseInt(params.number)).then((data) => {
			setData(data.restaurant);
		});
	}, []);

	if (!data) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full">
			<Header />
			<div className="px-10 py-4 flex flex-col">
				<div className="flex flex-row">
					<div className="self-start py-1">
						<img
							src='/restaurant_template_image.jpg'
							alt='Restaurant Image template'
							className="w-128 h-64 mr-4"
						/>
					</div>
					<div className="self-start py-20 text-orange-950">
						<h1 className="text-3xl font-bold">{data.name}</h1>
						<p>Indirizzo: {data.address}</p>
						<p>Città: {data.city}</p>
						<p>Cucina: {data.cuisine}</p>
					</div>
				</div>
				<span className="flex items-center mt-8">
					<span className="h-px flex-1 bg-orange-950"></span>
				</span>
				<MenuTable menuData={data.menu} params={params}/>
				<span className="flex items-center mt-8">
					<span className="h-px flex-1 bg-orange-950"></span>
				</span>
			</div>
		</div>
	)
}