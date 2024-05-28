"use server";
import MenuTable from '@/src/components/menu_table';
import { getMenuWithOrdersQuantityByIdReservation, getUserOfReservation } from '../../../lib/database/reservation';
import { UserInvite } from '../../../components/user_invite';
import { redirect } from 'next/navigation';

export default async function Page({ params }: { params: { number: string } }) {

	let reservation = null;
	try {
		reservation = (await getMenuWithOrdersQuantityByIdReservation(parseInt(params.number)));
	} catch (e) {
		console.error(e);
		redirect("/user/reservations_list");
	}
	const data = reservation.restaurant;
	const status = reservation.state;
	if(status !== 'accept')
		redirect("/user/reservations_list")
	const isPresent = await getUserOfReservation(parseInt(params.number));
	if(!isPresent)
		return (<UserInvite reservationId={parseInt(params.number)}/>);
	if (reservation == null) {
		return (
			<div className="bg-gray-100 p-4 rounded-md">
				<p className="text-gray-600">Non ci sono ordini per questa prenotazione</p>
			</div>
		);
	}

	return (
		<div className="w-full">
			<div className="px-10 py-4 flex flex-col">
				<div className="flex flex-col md:flex-row">
					<div className="self-start py-1">
						<img
							src='/restaurant_template_image.jpg'
							alt='Restaurant Image template'
							className="w-128 h-64 mr-4"
						/>
					</div>
					<div className="self-start py-5 md:py-20 text-orange-950">
						<h1 className="text-3xl font-bold">{data.name}</h1>
						<p>Indirizzo: {data.address}</p>
						<p>Città: {data.city}</p>
						<p>Cucina: {data.cuisine}</p>
					</div>
				</div>
				<span className="flex items-center mt-8">
					<span className="h-px flex-1 bg-orange-950"></span>
				</span>
				<MenuTable menuData={data.menu} params={params} />
				<span className="flex items-center mt-8">
					<span className="h-px flex-1 bg-orange-950"></span>
				</span>
			</div>
		</div>
	)
}