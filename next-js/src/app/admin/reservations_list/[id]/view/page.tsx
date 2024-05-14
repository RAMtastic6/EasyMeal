'use client';
import { useEffect, useState } from "react";
import { getReservationById } from "@/src/lib/database/reservation";

export default function ReservationAdmin({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>({}); // TO DO: define the type of the reservation object
  useEffect(() => {
    async function fetchReservation() {
      const result = await getReservationById(parseInt(params.id));
      setReservation(result);
      setLoading(false);
    }
    fetchReservation();
  }, []);

  const handleAccept = async () => {
    // TO DO: implement the accept reservation logic
  };

  if (loading)
    return <div>Loading...</div>;

  return (
    <div className="w-full">
      <div className="w-full">
        <button onClick={() => window.history.back()}>Torna alla pagina precedente</button>
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
                  <button className="bg-orange-500 text-black px-4 py-2 rounded">Rifiuta</button>
                </div>
              </div>
            </div>
          )}
          {reservation.state === "accept" && (
            <div>
              <div className="bg-green-200 p-4">
                La prenotazione è stata accettata.
              </div>
              <div className="bg-red-200 p-4">
                Le ordinazioni:
                <ul>
                  {reservation.orders.map((order: any) => (
                    <li key={order.id}>{order.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {reservation.state === "reject" && (
            <div className="bg-red-200 p-4">
              La prenotazione è stata rifiutata.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}