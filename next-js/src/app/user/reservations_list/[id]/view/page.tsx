'use client'
import ReservationDetails from "@/src/components/reservation_user";

export default async function ReservationUser({ params }: { params: { id: string } }) {
  return (
    <div className="w-full">
      <div className="container mx-auto mt-4">
        <button
          onClick={() => window.history.back()}
          className="bg-orange-500 text-white px-4 py-2 rounded mb-4 hover:bg-orange-600"
        >
          Torna alla pagina precedente
        </button>
        <h1 className="text-2xl mt-4">Consulta la tua prenotazione {params.id}</h1>
        <div className="mt-4 space-y-4">
          <ReservationDetails params={params} />
        </div>
      </div>
    </div>
  );
} 