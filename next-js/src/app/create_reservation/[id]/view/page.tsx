"use client";
import { getRestaurantById } from "@/src/lib/database/restaurant";
import { getMenuByRestaurantId } from "@/src/lib/database/menu";
import ReservationForm from "@/src/components/reservation_form";
import Header from "@/src/components/header";
import { useEffect, useState } from "react";
import FoodList from "@/src/components/food_list";

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
      setRestaurant(result);
      setMenu(menu_data?.menu?.foods ?? null);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="w-full">
      <div className="px-10 py-4 flex flex-col">
        <div className="flex flex-row flex-wrap"> {/* Aggiunta della classe flex-wrap */}
          <div className="self-start py-1 flex-shrink-0"> {/* Aggiunta della classe flex-shrink-0 */}
            <img
              src="/restaurant_template_image.jpg"
              alt="Restaurant Image template"
              className="w-80 h-64 object-cover object-center mr-4"
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
          <div>
            {menu && <FoodList menu={menu} />}
            {!menu && <p>Menu non disponibile</p>}
          </div>
          <div>
            {menu && <ReservationForm restaurant_id={parseInt(id)} />}
            {!menu && <p>Non è possibile prenotare in questo ristorante</p>}
          </div>
        </div>
      </div>
    </div>

  );
}
