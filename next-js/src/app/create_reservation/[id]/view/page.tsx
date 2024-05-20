"use client";
import { getRestaurantById } from "@/src/lib/database/restaurant";
import { getMenuByRestaurantId } from "@/src/lib/database/menu";
import ReservationForm from "@/src/components/reservation_form";
import Header from "@/src/components/header";
import { useEffect, useState } from "react";

export default function Page({ params }: { params: { id: string } }) {
  const id = params.id;
  const [loading, setLoading] = useState(true);
  const [restaurant, setRestaurant] = useState({
    name: "",
    address: "",
    city: "",
    cuisine: "",
  });
  const [menu, setMenu] = useState<any[]>([]);
  useEffect(() => {
    async function fetchData() {
      // chiamata che prende il ristorante
      const result = await getRestaurantById(parseInt(id));
      console.log(result.menu_id);
      // chiamata che prende il menu
      const menu_data = await getMenuByRestaurantId(result.menu_id);
      console.log(menu_data.menu.foods);

      setRestaurant(result);
      setMenu(menu_data.menu.foods);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <div className="px-10 py-4 flex flex-col">
        <div className="flex flex-row">
          <div className="self-start py-1">
            <img
              src="/restaurant_template_image.jpg"
              alt="Restaurant Image template"
              className="w-128 h-64 mr-4"
            />
          </div>
          <div className="self-start py-20 text-orange-950">
            <h1 className="text-3xl font-bold">{restaurant.name}</h1>
            <p>Indirizzo: {restaurant.address}</p>
            <p>Città: {restaurant.city}</p>
            <p>Cucina: {restaurant.cuisine}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div className="rounded-lg bg-white shadow-lg p-12 space-y-4">
            <h2 className="text-2xl font-bold text-orange-950 text-center">
              Menu:{" "}
            </h2>
            <div className="container mx-auto">
              <ul>
                {" "}
                {menu.map((item) => (
                  <li className="bg-white p-4" key={item["id"]}>
                    {" "}
                    {item["name"]} - {item["price"]}{"€"}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <ReservationForm restaurant_id={parseInt(id)} />
          </div>
        </div>
      </div>
    </div>
  );
}
