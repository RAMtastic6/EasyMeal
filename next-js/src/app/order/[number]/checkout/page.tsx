"use server";
import { IngredientChart } from '../../../../components/ingredient_chart';
import { getOrderByReservationId } from '../../../../lib/database/order';


export default async function Page({ 
  params: { 
    number
  }} : {
  params: {
    number: number;
  }
}) {  
  const orders = await getOrderByReservationId(number);
  return (
    <IngredientChart fetchedOrders={orders} reservationId={number}/>
  );
}

