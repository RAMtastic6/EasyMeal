'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getFilteredRestaurants, RestaurantFilter } from '../lib/database/restaurant';
import SkeletonTable from './skeleton_restaurants_table';

export default function RestaurantsTable() {
    const searchParams = useSearchParams();
    const [restaurants, setRestaurants] = useState<any[]>([]);
    const [loadingRestaurant, setLoadingRestaurant] = useState(true);
    
    //useEffect per ottenere i ristoranti filtrati ed aspettare che la promise venga risolta
    //viene chiamata 2 volte ma è normale in RUN DEV
    useEffect(() => {
        async function fetchRestaurants() {
            const filter: RestaurantFilter = {
                name: searchParams.get('nameRestaurant') || "",
                date: searchParams.get('date') || "",
                city: searchParams.get('city') || "",
                cuisine: searchParams.get('cuisine') || ""
            };
            try {
                // Simulated wait time
                console.log('Fecthing restaurants data...');
                await new Promise((resolve) => setTimeout(resolve, 1000));
                
                const json = await getFilteredRestaurants(filter);
                console.log('Data fecth completed after 3 seconds.');
                setRestaurants(json);
            } catch (error) {
                console.error('Error fetching restaurants', error);
            } finally {
                setLoadingRestaurant(false);
            }
        };
        setLoadingRestaurant(true);
        fetchRestaurants();
    }, [searchParams]);

    if (loadingRestaurant) {
        return (
            <div>
                <SkeletonTable />
            </div>
        );
    }
    
    if (restaurants.length === 0) {
        return (
            <div>
                <p>Nessun ristorante trovato</p>
            </div>
        );
    }
    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200 table-auto">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Indirizzo</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Città</th>
                        <th className="px-2 py-1 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cucina</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                            <td className="px-2 py-1 whitespace-nowrap"><Link href={`/create_reservation/${restaurant.id}/view`}>{restaurant.name}</Link></td>
                            <td className="px-2 py-1 whitespace-nowrap">{restaurant.address}</td>
                            <td className="px-2 py-1 whitespace-nowrap">{restaurant.city}</td>
                            <td className="px-2 py-1 whitespace-nowrap">{restaurant.cuisine}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}