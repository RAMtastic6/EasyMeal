"use server";
import PaymentMethod from '@/src/components/payment_method';
import { IngredientChart } from '../../../../components/ingredient_chart';
import { getOrderByReservationId } from '../../../../lib/database/order';


export default async function Page({
  params: {
    number
  } }: {
    params: {
      number: number;
    }
  }) {
  const orders = await getOrderByReservationId(number);
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
      <PaymentMethod params={{ number: String(number) }} />
    </>
  );
}

