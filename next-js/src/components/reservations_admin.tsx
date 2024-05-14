'use client';
import { getReservationsByRestaurantId } from "@/src/lib/database/reservation";
import { join } from "path";
import { useEffect, useState } from "react";
import Link from 'next/link';

export default function ReservationsAdmin() {
  const restaurantId = 1; // TO DO: get restaurant id from user
  const [reservations, setReservations] = useState<any[]>([]);
  useEffect(() => {
    async function fetchReservations() {
      try {
        const json = await getReservationsByRestaurantId(restaurantId);
        setReservations(json);
      } catch (error) {
        console.error("Error fetching reservations", error);
      }
    }
    fetchReservations();
  }, []);
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Numero persone</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stato</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Giorno e ora</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservations.map((reservation) => (
            <tr key={reservation.id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{reservation.id}</td>
              <td className="px-4 py-2">{reservation.number_people}</td>
              <td className="px-4 py-2">{reservation.state}</td>
              <td className="px-4 py-2">{(new Date(reservation.date)).toLocaleString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric', hour: 'numeric', minute: 'numeric' })}</td>
              <td className="px-4 py-2"><Link href={`/admin/reservations_list/${reservation.id}/view`} className="text-orange-500 hover:text-orange-700">Visualizza</Link></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}