import ReservationDetails from "@/src/components/reservation_admin";
import { verifySession } from "@/src/lib/dal";
import { getReservationsByAdminId } from "@/src/lib/database/reservation";
import { redirect } from "next/navigation";

export default async function ReservationAdmin({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const reservations = await getReservationsByAdminId();
  const session = await verifySession();
  // Check if the user is logged in and if the admin is associated with the reservation
  if(session == null || session.role !== 'admin' || reservations.map((reservation: any) => reservation.id).includes(id) === false) {
    redirect('/login');
  }
  return (
    <div className="w-full">
      <div className="container mx-auto mt-4">
        <a href="/admin/reservations_list" className="bg-orange-500 text-white px-4 py-2 rounded mb-4 hover:bg-orange-600">Torna alla lista</a>
        <h1 className="text-2xl mt-4">Consulta la prenotazione {id}</h1>
        <div className="mt-4 space-y-4">
          <ReservationDetails params={params} />
        </div>
      </div>
    </div>
  );
}