import ReservationsAdmin from '@/src/components/reservations_admin';

export default function ReservationsAdminPage() {
  return (
    <div className="w-full">
    <div className="container mx-auto mt-4 space-y-4">
      <h1>Consulta le prenotazioni del tuo ristorante</h1>
      <ReservationsAdmin />
    </div>
  </div>
  );
}