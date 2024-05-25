import ReservationsAdmin from '@/src/components/reservations_admin';
import { getReservationsByAdminId } from '../../../lib/database/reservation';
import { verifySession } from '../../../lib/dal';
import { redirect } from 'next/navigation';

export default async function ReservationsAdminPage() {
  const session = await verifySession();
  if(session == null || session.role !== 'admin') {
    redirect('/login');
  }
  return (
    <div className="w-full">
    <div className="container mx-auto mt-4 space-y-4">
      <h1 className="text-3xl font-semibold">Lista prenotazioni</h1>
      <p className='text-lg text-gray-500'>Qui puoi visualizzare le prenotazioni effettuate dai clienti</p>
      <ReservationsAdmin />
    </div>
  </div>
  );
}