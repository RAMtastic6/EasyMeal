import ReservationsUser from '@/src/components/reservations_user';
import { verifySession } from '../../../lib/dal';
import { redirect } from 'next/navigation';

export default async function ReservationsUserPage() {
  const session = await verifySession();
  if (session == null || session.role !== 'customer') {
    redirect('/login');
  }
  return (
    <div className="w-full">
      <div className="container mx-auto mt-4 space-y-4">
        <h1 className="text-3xl font-semibold">Lista prenotazioni</h1>
        <p className='text-lg text-gray-500'>Qui puoi visualizzare le prenotazioni effettuate</p>
        <ReservationsUser userId={session.id} />
      </div>
    </div>
  );
}