import Header from "../../components/header";
import Table from '../../components/restaurants_table';
import RestaurantSearch from '../../components/restaurant_search';
import { getAllCities, getAllCuisines } from "@/src/lib/database/restaurant";

export default async function Page() {
  const cuisines = await getAllCuisines();
  const cities = await getAllCities();

  return (
    <div className="w-full">
      <Header />
      <div className="container mx-auto mt-4 space-y-4">
        <h1 className="text-lg font-bold text-center text-red-950"> Effettua una prenotazione </h1>
        <RestaurantSearch cuisines={cuisines} cities={cities} />
        <Table />
      </div>
    </div>
  )
}
