"use client";
import { useEffect, useState } from "react";
import { getOrderByReservationId, updateIngredientsOrder } from "../lib/database/order";

export function IngredientChart({ fetchedOrders, reservationId } :
  { fetchedOrders: any, reservationId: number }
) {
  const removeIngredient = async (key: string, dishIndex: number, ingredientIndex: number, id: number) => {
    const newOrders = { ...orders };
    newOrders[key][dishIndex].ingredients.splice(ingredientIndex, 1);
    setOrders(newOrders);
    const x= await updateIngredientsOrder({
      id: id,
      ingredients: newOrders[key][dishIndex].ingredients
    });
    console.log(x);
  };

  const [orders, setOrders] = useState<any>(fetchedOrders);
  return (
    Object.entries(orders).map(([key, value]: [string, any]) => { 
      return (
      <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">{key}</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {value.map((order: any, index: number) => {
          return (
          <div key={index} className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">{order.food.name}</h2>
            <ul>
              {order.ingredients.map((ingredient: any, ingredientIndex: number) => (
                <li key={ingredientIndex} className="flex justify-between items-center mb-2">
                  <span>{ingredient.name}</span>
                  <button onClick={() => removeIngredient(key, index, ingredientIndex, order.id)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        )})}
      </div>
    </div>
    )})
  );
}