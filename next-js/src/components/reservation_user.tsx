'use client'
import { useEffect, useState } from "react";
import { getReservationById } from "@/src/lib/database/reservation";

export default function ReservationUser({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<any>({}); // TO DO: define the type of the reservation object
  const [orders, setOrders] = useState<any[]>([]); // TO DO: define the type of the orders object

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
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitalData();
  }, []);

  return (
    <div className="w-full">
      <div className="container mx-auto mt-4">
        <div className="mt-4 space-y-4">
          <div>
            <p>Nome: {reservation.name}</p>
            <p>Email: {reservation.email}</p>
            <p>Telefono: {reservation.phone}</p>
            <p>Data: {reservation.date}</p>
            <p>Ora: {reservation.time}</p>
            <p>Numero di persone: {reservation.people_number}</p>
            <p>Stato: {reservation.state}</p>
          </div>
        </div>
      </div>
    </div>
  );
}