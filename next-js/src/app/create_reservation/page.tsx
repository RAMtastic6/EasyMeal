import Header from "@/src/components/header";
import Table from '@/src/components/restaurants_table';
import RestaurantSearch from '@/src/components/restaurant_search';
import Pagination from '@/src/components/pagination';
import { getAllCities, getAllCuisines, getRestaurantsTotalPages } from "@/src/lib/database/restaurant";
import { RestaurantFilter } from "@/src/lib/database/restaurant";


export default async function Page({ searchParams }: {
  searchParams?: {
    date?: string,
    nameRestaurant?: string,
    city?: string,
    cuisine?: string,
    page?: string
  }
}) {
  const ITEMS_PER_PAGE = 1;
  const cuisines = await getAllCuisines();
  const cities = await getAllCities();
  const query: RestaurantFilter = {
    date: searchParams?.date || "",
    name: searchParams?.nameRestaurant || "",
    city: searchParams?.city || "",
    cuisine: searchParams?.cuisine || ""
  }
  const totalPages = await getRestaurantsTotalPages(query, ITEMS_PER_PAGE);
  console.log('Total pages:', totalPages);

  return (
    <>
      <div className="w-full">
        <div className="container mx-auto mt-4 space-y-4">
          <h1 className="text-lg font-bold text-center text-red-950"> Effettua una prenotazione se sei un chad </h1>
          <RestaurantSearch cuisines={cuisines} cities={cities} />
          <Table ITEMS_PER_PAGE={ITEMS_PER_PAGE} />
        </div>
        <div className="mt-5 flex w-full justify-center">
          <Pagination totalPages={totalPages} />
        </div>
      </div>
    </>
  )
}
