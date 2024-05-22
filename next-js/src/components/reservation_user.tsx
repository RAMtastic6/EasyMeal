'use client'
import { useEffect, useState } from "react";
import { getReservationById } from "@/src/lib/database/reservation";
import { stateMessage } from "@/src/lib/types/definitions";
import { getRestaurantById } from "../lib/database/restaurant";
import { set } from "firebase/database";

export default function ReservationUser({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>({}); // TO DO: define the type of the reservation object
  const [restaurant, setRestaurant] = useState<any>({}); // TO DO: define the type of the restaurant object
  const [orders, setOrders] = useState<any[]>([]); // TO DO: define the type of the orders object


  async function fetchRestaurant() {
    setLoading(true);
    try {
      console.log("Fetching restaurant data...");
      const result = await getRestaurantById(reservation.restaurant_id);
      setRestaurant(result);
    } catch (error) {
      console.error("Error fetching restaurant", error);
    }
    finally {
      setLoading(false);
    }
  }
  // fetch orders by reservation id if the reservation is accepted or to_pay
  useEffect(() => {
    async function fetchInitalData() {
      setLoading(true);
      try {
        console.log("Fetching orders data...");
        const result1 = await getReservationById(parseInt(params.id));
        console.log(result1.restaurant_id);
        setReservation(result1);
        const result2 = await getRestaurantById(result1.restaurant_id);
        setRestaurant(result2);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitalData();
  }, [params.id]);

  if (loading) return (<p>Loading...</p>);

  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <div className="container mx-auto mt-4 space-y-8 p-6 bg-white shadow-lg rounded-lg">

            <div className="text-2xl font-semibold text-gray-800">
              Ristorante
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-bold">Ristorante:</span>
                <span> {restaurant.name}</span>
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

            <div className="text-2xl font-semibold text-gray-800">
              Prenotazione
            </div>
            <ul className="space-y-2 text-gray-700">
              <li>
                <span className="font-bold">Numero persone:</span>
                <span> {reservation.number_people}</span>
              </li>
              <li>
                <span className="font-bold">Stato:</span>
                <span> {stateMessage[reservation.state as keyof typeof stateMessage]}</span>
              </li>
              <li>
                <span className="font-bold">Giorno:</span>
                <span> {(new Date(reservation.date)).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</span>
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
                <div className="bg-green-200 p-4">
                  La prenotazione è stata accettata. Le ordinazioni sono in attesa di conferma.
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
                <div className="bg-red-200 p-4">
                  Le ordinazioni sono state confermate. La prenotazione è in attesa di pagamento.
                </div>
              </div>
            )}
            {reservation.state === "completed" && (
              <div className="bg-green-200 p-4">
                La prenotazione è stata pagata e completata.
              </div>
            )}
            {(reservation.state === "to_pay" || reservation.state === "accept") && (
              <div>
                <div className="bg-white p-4">
                  <h2 className="text-2xl font-bold mb-4">Le ordinazioni</h2>
                  {orders.length === 0 && <p>Non ci sono ancora ordini per questa prenotazione</p>}
                  <ul>
                    {Object.keys(orders).map((key: string) => (
                      <div key={orders[key as keyof typeof orders]} className="container mx-auto">
                        <h1 className="text-3xl font-bold mb-4">{key}</h1>
                        {orders[key as keyof typeof orders].length === 0 && (
                          <p className="text-gray-600">Non ci sono ordini per questa prenotazione</p>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {orders[key as keyof typeof orders].map((order: any, dishIndex: number) => (
                            <div key={dishIndex} className="bg-white shadow-md rounded p-4">
                              <p>Cliente {order.customer_id}</p>
                              <h2 className="text-xl font-semibold mb-2">{order.food.name}</h2>
                              <ul>
                                {order.ingredients.map((ingredient: any, ingredientIndex: number) => (
                                  <li key={ingredientIndex} className="flex justify-between items-center mb-2">
                                    <span>{ingredient.ingredient.name}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}