"use client";
import { useEffect, useState } from 'react';
import { getOrderByReservationId } from '../../../../lib/database/order';

export default function Page() {  
  const [dishes, setDishes] = useState([
    { name: 'Caprese Salad', ingredients: ['Tomatoes', 'Mozzarella', 'Basil'] },
    { name: 'Caesar Salad', ingredients: ['Lettuce', 'Croutons', 'Parmesan', 'Caesar Dressing'] },
    { name: 'Grilled Cheese Sandwich', ingredients: ['Bread', 'Cheese'] },
  ]);

  const removeIngredient = (dishIndex, ingredientIndex) => {
    setDishes(prevDishes => {
      const newDishes = [...prevDishes];
      newDishes[dishIndex].ingredients.splice(ingredientIndex, 1);
      return newDishes;
    });
  };

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrderByReservationId(1).then((data) => {  
      setOrders(data);
      console.log(data);
    });
  }, []);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold mb-4">Dishes</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dishes.map((dish, index) => (
          <div key={index} className="bg-white shadow-md rounded p-4">
            <h2 className="text-xl font-semibold mb-2">{dish.name}</h2>
            <ul>
              {dish.ingredients.map((ingredient, ingredientIndex) => (
                <li key={ingredientIndex} className="flex justify-between items-center mb-2">
                  <span>{ingredient}</span>
                  <button onClick={() => removeIngredient(index, ingredientIndex)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">Remove</button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

