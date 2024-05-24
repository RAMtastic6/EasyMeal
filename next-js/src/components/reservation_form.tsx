import { createReservation } from "../lib/database/reservation";
import { useState } from 'react';
import Link from "next/link";

export default function ReservationForm({
	restaurant_id,
}: {
	restaurant_id: number;
}) {
	const [reservationNumber, setReservationNumber] = useState<string | null>(null);
	const [copySuccess, setCopySuccess] = useState(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const date = new Date(`${formData.get("date")}T${formData.get("time")}:00`);
		const options = { timeZone: 'Europe/Rome' };
		const isoString = date.toLocaleString('en-US', options);
		const json = {
				date: isoString,
				number_people: parseInt(formData.get("number_people") as string),
				restaurant_id: restaurant_id,
		};

		// Create reservation
		const response = await createReservation(json);
		if (response != null && response.status) {
				setReservationNumber(response.body.id.toString());
		}
		else {
				alert("Errore nella prenotazione");
		}
	}

	/*const generateRandomReservationNumber = () => {
			// Generate a random 6-digit reservation number for now
			return Math.floor(100000 + Math.random() * 900000).toString();
	};*/

	const handleCopy = () => {
		const linkText = `${window.location.origin}/order/${reservationNumber}/`;
		navigator.clipboard.writeText(linkText)
			.then(() => {
				setCopySuccess(true);
			})
			.catch(err => {
				console.error('Failed to copy: ', err);
			});
	};

	const link = () => (
		<Link href={`/order/${reservationNumber}`}>{
			`${window.location.origin}/order/${reservationNumber}`
		}</Link>
	);

	const confirmationPage = (
		<div className="rounded-lg bg-white shadow-lg p-12 space-y-4">
			<h2 className="text-2xl font-bold text-orange-950 text-center">Prenotazione confermata!</h2>
			<p className="text-center">Il tuo numero di prenotazione è: {reservationNumber}</p>
			<p className="text-center">Utilizza il seguente link per fare l'ordinazione:</p>
			<div className="flex justify-center">
				<p className="text-center w-1/2 rounded-md border-2 border-orange-700 py-2.5 pe-2 shadow-sm sm:text-sm pl-[14px] text-gray-600">{link()}</p>
				<button onClick={handleCopy} className="rounded-lg bg-orange-950 px-5 py-3 font-medium text-white">
					{copySuccess ? 'Copied!' : 'Copy Link'}
				</button>
			</div>
			<div className="flex justify-center">
				<Link href={`/order/${reservationNumber}`}
					className="rounded-lg bg-orange-950 px-5 py-3 font-medium text-white text-center"
				>
					Continua</Link>
			</div>
		</div>
	);

	return (
		<>
			{reservationNumber ? (
				confirmationPage
			) : (
				<div className="rounded-lg bg-white shadow-lg p-12 space-y-4">
					<h2 className="text-2xl font-bold text-orange-950 text-center">Effettua una prenotazione</h2>
					<form action="#" className="space-y-4" onSubmit={handleSubmit}>
						<div className="relative">
							<label>Data:</label>
							<input
								name="date"
								type="date"
								className="w-full rounded-md border-2 border-orange-700 py-2.5 pe-2 shadow-sm sm:text-sm pl-[14px] text-gray-600"
								data-testid={"InputData"}
							/>
						</div>

						<div className="relative">
							<p>Ora di arrivo:</p>
							<input
								name="time"
								type="time"
								className="w-full rounded-md border-2 border-orange-700 py-2.5 pe-2 shadow-sm sm:text-sm pl-[14px] text-gray-600"
								data-testid={"InputOra"}
							/>
						</div>

						<div className="relative">
							<p>Numero di persone:</p>
							<input
								name="number_people"
								type="number"
								className="w-full rounded-md border-2 border-orange-700 py-2.5 pe-2 shadow-sm sm:text-sm pl-[14px] text-gray-600"
								data-testid={"InputPersone"}
							/>
						</div>
						<div className="mt-4 flex justify-center">
							<button
								type="submit"
								className="rounded-lg bg-orange-950 px-5 py-3 font-medium text-white"
								data-testid={"ButtonPrenota"}
							>
								Prenota
							</button>
						</div>
					</form>
				</div>
			)}
		</>
	);
}