import ReservationsAdmin from '@/src/components/reservations_admin';
import { getReservationsByRestaurantId } from '../../../lib/database/reservation';
import { verifySession } from '../../../lib/dal';

export default async function ReservationsAdminPage() {
  const userId = (await verifySession()).id;
  return (
    <div className="w-full">
    <div className="container mx-auto mt-4 space-y-4">
      <h1 className="text-3xl font-semibold">Lista prenotazioni</h1>
      <p className='text-lg text-gray-500'>Qui puoi visualizzare le prenotazioni effettuate dai clienti</p>
      <ReservationsAdmin userId={userId}/>
    </div>
  </div>
  );
}