"use server";
import { redirect } from 'next/navigation';
import PaymentMethod from '@/src/components/payment_method';
import { IngredientChart } from '../../../../components/ingredient_chart';
import { UserInvite } from '../../../../components/user_invite';
import { getOrderByReservationId } from '../../../../lib/database/order';
import { getUserOfReservation } from '../../../../lib/database/reservation';


export default async function Page({
  params: {
    number
  } }: {
    params: {
      number: number;
    }
  }) {
  let orders = null;
  try {
    orders = await getOrderByReservationId(number);
  } catch (e) {
    console.error(e);
    redirect("/user/reservations_list");
  }
  if(orders?.reservation && orders.reservation?.state !== 'accept')
    redirect("/user/reservations_list");

  const isPresent = await getUserOfReservation(number);
  if(!isPresent)
    return (<UserInvite reservationId={number}/>)

  if (orders == null) {
    return (
      <div className="bg-gray-100 p-4 rounded-md">
        <p className="text-gray-600">Non ci sono ordini per questa prenotazione</p>
      </div>
    );
  }
  return (
    <>
      <IngredientChart fetchedOrders={orders} reservationId={number} />
    </>
  );
}

