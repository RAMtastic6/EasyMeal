'use client'
import { useEffect, useState } from "react";
import { acceptReservation, getReservationById, rejectReservation } from "@/src/lib/database/reservation";
import { getOrderByReservationId } from "@/src/lib/database/order";
import { stateMessage } from "@/src/lib/types/definitions";

export default function ReservationDetails({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);

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

  // fetch orders by reservation id if the reservation is accepted or to_pay
  useEffect(() => {
    async function fetchInitalData() {
      setLoading(true);
      try {
        console.log("Fetching orders data...");
        const reservation = await getReservationById(parseInt(params.id));
        setReservation(reservation);
        if (reservation.state === 'accept' || reservation.state === 'to_pay' || reservation.state === 'completed') {
          const orders = await getOrderByReservationId(parseInt(params.id));
          setOrders(orders);
        }
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitalData();
  }, []);

  const handleAccept = async () => {
    const response = await acceptReservation(parseInt(params.id));
    if (!response.status || response.body == null) {
      alert("Errore nella modifica della prenotazione");
    } else {
      fetchReservation();
    }
  }

  const handleReject = async () => {
    const response = await rejectReservation(parseInt(params.id));
    if (!response.status || response.body == null) {
      alert("Errore nella modifica della prenotazione");
    } else {
      fetchReservation();
    }
  }

  const calculateIngredientTotals = (orders: any) => {
    const totals: { [key: string]: number } = {};

    Object.keys(orders).forEach((key) => {
      orders[key].forEach((order: any) => {
        {
          order.ingredients
            .filter((ingredient: any) => !ingredient.removed).forEach((ingredient: any) => {
              const name = ingredient.ingredient.name;
              if (!totals[name]) {
                totals[name] = 0;
              }
              totals[name] += 1;
            });
        }
      }
      );
    });

    return totals;
  };

  const ingredientTotals = orders ? calculateIngredientTotals(orders) : {};

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <div className="container mx-auto mt-4 space-y-4">
            <ul className="space-y-4">
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
                <ul className="space-y-4">
                  <li>
                    <span className="font-bold">Posti disponibili:</span>
                    <span> 10</span>
                  </li>
                </ul>
                <div className="bg-yellow-200 p-4">
                  La prenotazione è in attesa di conferma.
                  <div className="flex space-x-4">
                    <button onClick={handleAccept} className="bg-orange-500 text-black px-4 py-2 rounded">Accetta</button>
                    <button onClick={handleReject} className="bg-orange-500 text-black px-4 py-2 rounded">Rifiuta</button>
                  </div>
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
            {(reservation.state === "to_pay" || reservation.state === "accept" || reservation.state === "completed") && (
              <div>
                {(!orders || orders.length === 0) ? (
                  <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-bold mb-4 text-gray-800">Le ordinazioni</h2>
                    <p className="text-gray-600">Non ci sono ancora ordini per questa prenotazione</p>
                  </div>
                ) : (
                  <>
                    {/* Ingredienti necessari Section */}
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                      <h2 className="text-2xl font-bold mb-4 text-gray-800">Ingredienti</h2>
                      <p className="text-gray-600 mb-4">Ingredienti necessari per le ordinazioni:</p>
                      <ul className="list-disc pl-6">
                        {Object.keys(ingredientTotals).map((ingredientName) => (
                          <li key={ingredientName} className="mb-2 text-gray-700">
                            <span className="font-semibold">{ingredientName}:</span> {ingredientTotals[ingredientName]}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-white p-4 mt-4">
                      <h2 className="text-2xl font-bold mb-4">Le ordinazioni</h2>
                      <ul>
                        {Object.keys(orders).map((key: string) => (
                          <div key={key} className="container mx-auto">
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
                          </div>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
