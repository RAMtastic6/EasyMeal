"use client";
import { useRouter } from "next/navigation";
import { acceptInviteReservation } from "../lib/database/reservation";

export function UserInvite({ reservationId }: { reservationId: number }) {
  const router = useRouter();

  async function acceptInvite() {
    const result = await acceptInviteReservation(reservationId);
    console.log(result);
    if (result.status) {
      router.push('/user/reservations_list');
    } else {
      console.log('Error accepting invite');
    }
  }

  async function refuseInvite() {
    router.push('/user/reservations_list');
  }

  return (
    <div className="flex items-center justify-center py-20 px-5">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-center">Vuoi accettare l'invito della prenotazione con id: {reservationId}?</h1>
        <div className="flex flex-col items-center justify-center mt-4">
          <button className="w-40 h-12 mt-4 bg-orange-950 text-white rounded-lg hover:bg-orange-800" onClick={() => acceptInvite()}>Accetta</button>
          <button className="w-40 h-12 mt-4 bg-orange-950 text-white rounded-lg hover:bg-orange-800" onClick={() => refuseInvite()}>Rifiuta</button>
        </div>
      </div>
    </div>

  );
}