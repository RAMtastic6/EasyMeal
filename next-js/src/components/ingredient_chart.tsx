"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Endpoints } from "../lib/database/endpoints";
import { saveOrders, updateIngredientsOrder, updateListOrders } from "../lib/database/order";
import { getToken } from "../lib/dal";
import PaymentMethod from "./payment_method";
import { setPaymentMethod } from "../lib/database/reservation";
import { useRouter } from "next/navigation";



export function IngredientChart({ fetchedOrders, reservationId }: { fetchedOrders: any, reservationId: number }) {
  const [orders, setOrders] = useState<any>(fetchedOrders);
  const [selectedOption, setSelectedOption] = useState('AllaRomana');
  const socket = useRef<Socket>();
  const router = useRouter();

  console.log(fetchedOrders);

  function onIngredient(body: any) {
    const newOrders = { ...orders };
    newOrders[body.key][body.index].ingredients[body.ingredientIndex].removed = body.removed;
    setOrders(newOrders);
  }

  function onConfirm() {
    router.push('/user/reservations_list/'+reservationId+'/view');
  }

  function changeIngredient(key: string, index: number, ingredientIndex: number) {
    const ingredients = [...orders[key][index].ingredients];
    const newOrders = { ...orders };
    newOrders[key][index].ingredients = ingredients;
    ingredients[ingredientIndex].removed = !ingredients[ingredientIndex].removed;
    setOrders(newOrders);
    socket.current?.emit('onIngredient', {
      id_prenotazione: reservationId,
      data: {
        key,
        index,
        ingredientIndex,
        removed: ingredients[ingredientIndex].removed,
      }
    });
  }

  useEffect(() => {
    getToken().then((token) => {
      if (!token) return;
      socket.current = io(Endpoints.socket, {
        query: {
          id_prenotazione: reservationId,
        },
        auth: {
          token: token,
        },
      });
      socket.current.on('onIngredient', onIngredient);
      socket.current.on('onConfirm', onConfirm);
    });
    return () => {
      socket.current?.off('onIngredient', onIngredient);
      socket.current?.off('onConfirm', onConfirm);
      socket.current?.disconnect();
    };
  }, []);

  async function submit() {
    const result = await updateListOrders({
      reservation_id: reservationId,
      orders: orders,
    });
    const isRomanBill = selectedOption === 'AllaRomana' ? true : false;
    const payment_method = await setPaymentMethod({ reservation_id: reservationId, isRomanBill });
    if (result == false || payment_method == false) {
      alert('Ordine già confermato!');
      router.push('/user/reservations_list/'+reservationId+'/view');
      return;
    }
    socket.current?.emit('onConfirm', {
      id_prenotazione: reservationId,
    });
    router.push('/user/reservations_list/'+reservationId+'/view');
    //TODO: riepilogo ordine? pagina apposta?
  }

  return (
    <>
      {Object.keys(orders).map((key: string) => (
        <div key={orders[key]} className="container mx-auto">
          <h1 className="text-2xl font-bold pt-2 pl-4 mb-4">{key}</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {orders[key].map((order: any, dishIndex: number) => (
              <div key={dishIndex} className="bg-white shadow-md rounded p-4">
                <h2 className="text-xl font-semibold mb-2">{order.food.name}</h2>
                <img src={order.food.image ?? '/caprese.png'} alt={order.food.name} className="w-full h-32 object-cover mb-2" />
                <ul>
                  {order.ingredients.map((ingredient: any, ingredientIndex: number) => (
                    <li key={ingredientIndex} className="flex justify-between items-center mb-2">
                      <span>{ingredient.ingredient.name}</span>
                      <button onClick={() => changeIngredient(key, dishIndex, ingredientIndex)} className={
                        ingredient.removed ? "bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded" : "bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                      }>
                        {ingredient.removed ? 'Aggiungi' : 'Rimuovi'}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}
      <PaymentMethod selectedOption={selectedOption} setSelectedOption={setSelectedOption} params={reservationId} />
      {/* Conferma */}
      <div className="flex justify-center mt-4 my-20">
        <div className="sm:flex sm:gap-4">
          <button onClick={submit} className="inline-block rounded bg-orange-950 px-8 py-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring" data-testid="conferma-button">
            Conferma
          </button>
        </div>
      </div>

    </>
  );
}