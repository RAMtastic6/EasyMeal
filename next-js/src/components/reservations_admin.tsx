'use client';
import { getReservationsByRestaurantId } from "@/src/lib/database/reservation";
import { join } from "path";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { stateMessage } from "@/src/lib/types/definitions";

export default function ReservationsAdmin() {
  const restaurantId = 1; // TO DO: get restaurant id from user
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function fetchReservations() {
      try {
        const json = await getReservationsByRestaurantId(restaurantId);
        setReservations(json);
      } catch (error) {
        console.error("Error fetching reservations", error);
      }
      finally {
        setLoading(false);
      }
    }
    setLoading(true);
    fetchReservations();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (reservations.length === 0) {
    return <div>Non è stata effettuata nessuna prenotazione</div>;
  }

  // Sort reservations by date in ascending order
  reservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numero partecipanti</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ora</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{reservation.id}</td>
              <td className="px-4 py-2">{reservation.number_people}</td>
              <td className="px-4 py-2">
                <span className={`text-${reservation.state === 'pending' ? 'yellow' : reservation.state === 'accept' ? 'green' : reservation.state === 'reject' ? 'red' : reservation.state === 'completed' ? 'blue' : 'purple'}-500 mr-1`}>&#11044;</span>
                {stateMessage[reservation.state as keyof typeof stateMessage]}
              </td>
              <td className="px-4 py-2">{(new Date(reservation.date)).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}</td>
              <td className="px-4 py-2">{(new Date(reservation.date)).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}</td>
              <td className="px-4 py-2"><Link href={`/admin/reservations_list/${reservation.id}/view`} className="text-orange-500 hover:text-orange-700">Visualizza</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <p className="text-base text-gray-500">Visualizzate {reservations.length} prenotazioni</p>
      </div>
    </div>
  );  
}