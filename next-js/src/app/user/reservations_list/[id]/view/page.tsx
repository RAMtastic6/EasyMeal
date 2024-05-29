import ReservationDetails from "@/src/components/reservation_user";
import { verifySession } from "@/src/lib/dal";
import { redirect } from "next/navigation";
import { getReservationById } from "@/src/lib/database/reservation";

export default async function ReservationUser({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const reservation = await getReservationById(id);
  const session = await verifySession();
  // Check if the user is logged in and if the reservation is associated with the user
  if (session == null || session.role !== 'customer' || reservation.users.map((user: any) => user.id).includes(session.id) === false) {
    redirect('/login');
  }
  return (
    <div className="w-full">
      <div className="container mx-auto mt-4">
        <a href="/user/reservations_list" className="bg-orange-500 text-white px-4 py-2 rounded mb-4 hover:bg-orange-600">Torna alla lista</a>
        <h1 className="text-2xl mt-4">Consulta la tua prenotazione {id}</h1>
        <div className="mt-4 space-y-4">
          <ReservationDetails params={params} />
        </div>
      </div>
    </div>
  );
} 