'use client';
import { useEffect, useState } from "react";
import { acceptReservation, getReservationById, rejectReservation } from "@/src/lib/database/reservation";
import { getOrderByReservationId } from "@/src/lib/database/order";

export default function ReservationAdmin({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>({}); // TO DO: define the type of the reservation object
  const [orders, setOrders] = useState<any[]>([]); // TO DO: define the type of the orders object
  useEffect(() => {
    async function fetchReservation() {
      try {
        const result = await getReservationById(parseInt(params.id));
        setReservation(result);
      } catch (error) {
        console.error("Error fetching reservation", error);
      }
      finally {
        setLoading(false);
      }
    }
    async function fetchOrders() {
      try {
        const result = await getOrderByReservationId(parseInt(params.id));
        setOrders(result);
      }
      catch (error) {
        console.error("Error fetching orders", error);
      }
      finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchReservation();
    fetchOrders();
  }, []);
  const handleAccept = async () => {
    const response = await acceptReservation(parseInt(params.id));
    if (!response.status || response.body == null) {
      alert("Errore nella modifica della prenotazione");
    };
  }

  const handleReject = async () => {
    const response = await rejectReservation(parseInt(params.id));
    if (!response.status || response.body == null) {
      alert("Errore nella modifica della prenotazione");
    }
  }

  if (loading)
    return <div>Loading...</div>;
  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <button onClick={() => window.history.back()} className="bg-grey-500 text-black px-4 py-2 rounded">Torna alla pagina precedente</button>
          <div className="container mx-auto mt-4 space-y-4">
            <h1>Consulta la prenotazione {params.id}</h1>
            <div>Numero persone: {reservation.number_people}</div>
            <div>Stato: {reservation.state}</div>
            <div>Giorno e ora: {(new Date(reservation.date)).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</div>

            {reservation.state === "pending" && (
              <div>
                <div>Posti disponibili: 10</div>
                <div className="bg-yellow-200 p-4">
                  La prenotazione è in attesa di conferma.
                  <div className="flex space-x-4">
                    <button onClick={handleAccept} className="bg-orange-500 text-black px-4 py-2 rounded">Accetta</button>
                    <button onClick={handleReject} className="bg-orange-500 text-black px-4 py-2 rounded">Rifiuta</button>
                  </div>
                </div>
              </div>
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