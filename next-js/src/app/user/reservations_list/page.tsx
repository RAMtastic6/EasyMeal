import ReservationsUser from '@/src/components/reservations_user';
import { getReservationsByUserId } from '../../../lib/database/reservation';
import { verifySession } from '../../../lib/dal';

export default async function ReservationsUserPage() {
  const userId = (await verifySession()).id;
  return (
    <div className="w-full">
    <div className="container mx-auto mt-4 space-y-4">
      <h1 className="text-3xl font-semibold">Lista prenotazioni</h1>
      <p className='text-lg text-gray-500'>Qui puoi visualizzare le prenotazioni effettuate</p>
      <ReservationsUser userId={userId}/>
    </div>
  </div>
  );
}