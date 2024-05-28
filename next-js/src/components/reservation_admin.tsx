'use client'
import { useEffect, useState } from "react";
import { acceptReservation, getReservationById, rejectReservation } from "@/src/lib/database/reservation";
import { getOrderByReservationId } from "@/src/lib/database/order";
import { stateMessage } from "@/src/lib/types/definitions";

export default function ReservationDetails({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>({});
  const [orders, setOrders] = useState<any[]>([]);
  const totalPrice = Object.keys(orders).map((key: string) => orders[key as keyof typeof orders].reduce((acc: number, order: any) => acc + (order.quantity * order.food.price), 0).toFixed(2));
  const totalPaid = Object.keys(orders)
    .flatMap((key: string) =>
      orders[key as keyof typeof orders]
        .filter((order: any) => order.paid)
        .map((order: any) => order.quantity * order.food.price)
    )
    .reduce((acc: number, amount: number) => acc + amount, 0);
  const usersThatPaid = Object.keys(orders).flatMap((key) => orders[key as keyof typeof orders].filter((order: any) => order.paid).map((order: any) => order.customer.name + " " + order.customer.surname)).join(", ");


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

  if (reservation.date < new Date().toISOString()) {
    return (
      <div className="container mx-auto mt-4 p-6 bg-100 rounded-lg shadow-lg">
        <div className="text-2xl font-semibold text-gray-800">Errore</div>
        <p className="text-gray-700">Non è possibile visualizzare la prenotazione selezionata poiché la data è passata.</p>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="w-full">
        <div className="w-full">
          <div className="container mx-auto mt-4 space-y-8 p-6 bg-100 rounded-lg shadow-lg">
            <div className="text-2xl font-semibold text-gray-800">Dettagli Prenotazione</div>
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
              <div className="bg-green-200 p-4 rounded-lg shadow-md text-center">
                <p className="text-lg font-semibold text-gray-800">
                  La prenotazione è stata accettata. Le ordinazioni sono in attesa di conferma.
                </p>
              </div>
            )}
            {reservation.state === "reject" && (
              <div className="bg-red-200 p-4">
                La prenotazione è stata rifiutata.
              </div>
            )}
            {reservation.state === "to_pay" && (
              <div>
                <div className="bg-100 border border-400 p-4 rounded-lg shadow-md text-center">
                  <ul className="space-y-2 text-gray-800 mt-4">
                    <li className="font-bold">Utenti che hanno partecipato:</li>
                    {Array.from(new Set(
                      Object.keys(orders).flatMap((key) =>
                        orders[key as keyof typeof orders]
                          .filter((order: any) => order.customer && order.customer.name && order.customer.surname)
                          .map((order: any) => `${order.customer.name} ${order.customer.surname}`)
                      )
                    )).map((customerFullName, index, array) => (
                      <span key={customerFullName} className="text-600">
                        {customerFullName}{index < array.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </ul>
                </div>
                <div className="bg-red-200 p-4 text-center rounded-lg shadow-md">
                  <p className="text-lg font-semibold">
                    Le ordinazioni sono state confermate. La prenotazione è in attesa di pagamento.
                  </p>
                </div>
                <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-center">
                  <h2 className="text-2xl mb-2">Totale: €{totalPrice}</h2>
                  <p>
                    Totale rimanente: €{(Number(totalPrice) - Number(totalPaid)).toFixed(2)}
                  </p>
                  <p className="text-gray-600 text-center mt-4">
                    La modalità scelta per la divisione del conto è: {reservation.isRomanBill ? "Romana" : "Proporzionale"}
                  </p>
                </div>
                {usersThatPaid && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg shadow-md text-center">
                    <p className="text-lg font-semibold">
                      Utenti che hanno pagato: {usersThatPaid}
                    </p>
                  </div>
                )}
                <div>
                  <p className="text-gray-600 text-center mt-4">
                    La prenotazione risulterà completata solo dopo il pagamento di tutte le quote.
                  </p>
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
                                  <p>Cliente {order.customer.name + " " + order.customer.surname}</p>
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
