"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { Endpoints } from "../lib/database/endpoints";
import { saveOrders, updateIngredientsOrder, updateListOrders } from "../lib/database/order";
import { getToken } from "../lib/dal";



export function IngredientChart({ fetchedOrders, reservationId }: { fetchedOrders: any, reservationId: number }) {
  const [orders, setOrders] = useState<any>(fetchedOrders);
  const socket = useRef<Socket>();

  function onIngredient(body: any) {
    const newOrders = { ...orders };
    newOrders[body.key][body.index].ingredients[body.ingredientIndex].removed = body.removed;
    setOrders(newOrders);
  }

  function onConfirm() {
    alert('Ordine confermato da un altro utente!');
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
      if(!token) return;
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
    if (result == false) {
      alert('Ordine già confermato!');
      return;
    }
    socket.current?.emit('onConfirm', {
      id_prenotazione: reservationId,
    });
    alert('Ordine aggiornato');
  }

  return (
    <>
      {Object.keys(orders).map((key: string) => (
        <div key={orders[key]} className="container mx-auto">
          <h1 className="text-3xl font-bold mb-4">{key}</h1>
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
      {/* Conferma */}
      <div className="flex justify-center my-4">
        <button onClick={submit} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded" data-testid="conferma-button">Conferma</button>
      </div>
    </>
  );
}