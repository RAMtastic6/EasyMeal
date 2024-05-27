'use client';
import { getReservationsByAdminId } from "@/src/lib/database/reservation";
import { useEffect, useState } from "react";
import Link from 'next/link';
import { stateMessage } from "@/src/lib/types/definitions";
import { filterAndFormatReservations } from "../lib/utils";

export default function ReservationsAdmin() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const json = await getReservationsByAdminId();
        setReservations(filterAndFormatReservations(json));
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reservations", error);
        setLoading(false);
      }
    };

    fetchReservations();
    const interval = setInterval(fetchReservations, 10000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (reservations.length === 0) {
    return <div>Non è stata effettuata nessuna prenotazione</div>;
  }

  // Sort reservations by date in ascending order
  reservations.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  function getStateColor(state: any) {
    switch (state) {
      case 'pending':
        return 'text-yellow-500 mr-1';
      case 'accept':
        return 'text-green-500 mr-1';
      case 'reject':
        return 'text-red-500 mr-1';
      case 'completed':
        return 'text-blue-500 mr-1';
      default:
        return 'text-purple-500 mr-1';
    }
  }

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
                <span className={getStateColor(reservation.state)}>&#11044;</span>
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