'use client'
import { useEffect, useState } from "react";
import { getReservationById, completeReservation } from "@/src/lib/database/reservation";
import { stateMessage } from "@/src/lib/types/definitions";
import { getRestaurantById } from "@/src/lib/database/restaurant";
import { getOrderByReservationId } from "@/src/lib/database/order";
import Link from "next/link";

export default function ReservationUser({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>({}); // TO DO: define the type of the reservation object
  const [restaurant, setRestaurant] = useState<any>({}); // TO DO: define the type of the restaurant object
  const [orders, setOrders] = useState<any[]>([]); // TO DO: define the type of the orders object
  const [copy, setCopy] = useState(false);

  // fetch reservation by id
  async function fetchReservation() {
    setLoading(true);
    try {
      console.log("Fetching reservation data...");
      const result = await getReservationById(parseInt(params.id));
      setReservation(result);
    } catch (error) {
      console.error("Error fetching reservation", error);
    }
    finally {
      setLoading(false);
    }
  }
  // fetch orders by reservation, restaurant and orders if the reservation is in a state different from pending
  useEffect(() => {
    async function fetchInitalData() {
      setLoading(true);
      try {
        console.log("Fetching orders data...");
        const result1 = await getReservationById(parseInt(params.id));
        setReservation(result1);
        const result2 = await getRestaurantById(result1.restaurant_id);
        setRestaurant(result2);
        if (result1.state === 'accept' || result1.state === 'to_pay' || result1.state === 'completed') {
          const orders = await getOrderByReservationId(parseInt(params.id));
          if (orders.length !== 0) {
            setOrders(orders);
          }
        }
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitalData();
  }, [params.id]);

  const handlePayment = async () => {
    // payment ...
    const response = await completeReservation(parseInt(params.id));
    if (!response.status || response.body == null) {
      alert("Errore nel completamento della prenotazione");
    } else {
      fetchReservation();
    }
  }

  const handleCopy = () => {
		const linkText = `${window.location.origin}/order/${params.id}/`;
		navigator.clipboard.writeText(linkText)
			.then(() => {
				setCopy(true);
			})
			.catch(err => {
				console.error('Failed to copy: ', err);
			});
	};

  const link = () => (
		<Link href={`/order/${params.id}`}>{
			`${window.location.origin}/order/${params.id}`
		}</Link>
	);

  if(reservation.date < new Date().toISOString()) {
    return (
      <div className="container mx-auto mt-4 p-6 bg-100 rounded-lg shadow-lg">
        <div className="text-2xl font-semibold text-gray-800">Errore</div>
        <p className="text-gray-700">Non è possibile visualizzare la prenotazione selezionata poiché la data è passata.</p>
      </div>
    );
  }

  if (loading) return (<p>Loading...</p>);

  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <div className="container mx-auto mt-4 space-y-8 p-6 bg-100 rounded-lg shadow-lg">

            <div className="text-2xl font-semibold text-gray-800">Informazioni sul Ristorante</div>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-bold">Ristorante:</span>
                <span className="capitalize"> {restaurant.name}</span>
              </li>
              <li>
                <span className="font-bold">Indirizzo:</span>
                <span> {restaurant.address}</span>
              </li>
              <li>
                <span className="font-bold">Città:</span>
                <span> {restaurant.city}</span>
              </li>
              <li>
                <span className="font-bold">Cucina:</span>
                <span> {restaurant.cuisine}</span>
              </li>
              <li>
                <span className="font-bold">Numero di telefono:</span>
                <span> {restaurant.phone_number}</span>
              </li>
              <li>
                <span className="font-bold">Email:</span>
                <span> {restaurant.email}</span>
              </li>
            </ul>

            <div className="text-2xl font-semibold text-gray-800">Dettagli Prenotazione</div>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-bold">Numero di persone:</span>
                <span> {reservation.number_people}</span>
              </li>
              <li>
                <span className="font-bold">Stato:</span>
                <span> {stateMessage[reservation.state as keyof typeof stateMessage]}</span>
              </li>
              <li>
                <span className="font-bold">Data:</span>
                <span> {(new Date(reservation.date)).toLocaleDateString('it-IT')}</span>
              </li>
              <li>
                <span className="font-bold">Ora:</span>
                <span> {(new Date(reservation.date)).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</span>
              </li>
            </ul>
            {reservation.state === "pending" && (
              <>
                <div className="bg-yellow-200 p-4">
                  La prenotazione è in attesa di conferma da parte dell'amministratore.
                </div>
              </>
            )}
            {(reservation.state === "accept") && (
              <div>
                <div className="bg-green-200 p-4 rounded-lg shadow-md text-center">
                  <p className="text-lg font-semibold text-gray-800">
                    La prenotazione è stata accettata. Le ordinazioni sono in attesa di conferma.
                  </p>
                </div>
                <div className="flex justify-center mt-4">
                  <a
                    href={`/order/${reservation.id}`}
                    className="bg-orange-500 text-white text-lg font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-orange-600 transition duration-300"
                  >
                    Vai all'ordinazione
                  </a>
                </div>
                <div className="flex justify-center">
                  <p className="text-center w-1/2 rounded-md border-2 border-orange-700 py-2.5 pe-2 shadow-sm sm:text-sm pl-[14px] text-gray-600">{link()}</p>
                  <button onClick={handleCopy} className="rounded-lg bg-orange-950 px-5 py-3 font-medium text-white" data-testid="ButtonCopia">
                    {copy ? 'Link copiato!' : 'Copia Link'}
                  </button>
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    Puoi modificare l'ordinazione entro 24 ore rispetto alla data stabilita per la prenotazione.
                  </p>
                </div>
              </div>

            )}
            {reservation.state === "reject" && (
              <div className="bg-red-200 p-4">
                La prenotazione è stata rifiutata.
              </div>
            )}
            {reservation.state === "to_pay" && (
              <div>
                <div className="bg-red-200 p-4 text-center rounded-lg shadow-md">
                  <p className="text-lg font-semibold">
                    Le ordinazioni sono state confermate. La prenotazione è in attesa di pagamento.
                  </p>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-center">
                  <h2 className="text-2xl mb-2">Totale: €{Object.keys(orders).map((key: string) => orders[key as keyof typeof orders].reduce((acc: number, order: any) => acc + (order.quantity * order.food.price), 0).toFixed(2))}</h2>
                </div>
                <div className="flex justify-center items-center mt-4">
                  <button onClick={handlePayment} className="bg-orange-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-orange-600 transition duration-300">
                    Paga
                  </button>
                </div>
              </div>
            )}
            {reservation.state === "completed" && (
              <div className="bg-green-200 p-4">
                La prenotazione è stata pagata e completata.
              </div>
            )}
            {(reservation.state === "to_pay" || reservation.state === "accept" || reservation.state === "completed") && (
              <div>
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">Le ordinazioni</h2>
                  {orders.length === 0 && <p className="text-gray-600">Non ci sono ancora ordini per questa prenotazione</p>}
                  <ul>
                    {Object.keys(orders).map((key: string) => (
                      <div key={key} className="container mx-auto mb-8">
                        <h1 className="text-3xl font-bold mb-4 text-gray-900 border-b-2 pb-2">{key}</h1>
                        {orders[key as keyof typeof orders].length === 0 ? (
                          <p className="text-gray-600">Non ci sono ordini per questa prenotazione</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {orders[key as keyof typeof orders] && Array.isArray(orders[key as keyof typeof orders]) && orders[key as keyof typeof orders].map((order: any, dishIndex: number) => (
                              <div key={dishIndex} className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                                <p className="text-gray-700 mb-2">Utente: <span className="font-medium">{order.user_id}</span></p>
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">{order.food.name} - €{order.food.price.toFixed(2)}</h2>
                                <ul className="text-gray-700">
                                  {order.ingredients
                                    .filter((ingredient: any) => !ingredient.removed) // Filtra gli ingredienti non rimossi
                                    .map((ingredient: any, ingredientIndex: number) => (
                                      <li key={ingredientIndex} className="flex justify-between items-center mb-2">
                                        <span>{ingredient.ingredient.name}</span>
                                        <span>{ingredient.quantity}</span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div >
        </div >
      </div >
    </>
  );
}