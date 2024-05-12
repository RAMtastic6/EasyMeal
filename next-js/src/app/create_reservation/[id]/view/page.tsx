'use client';
import { getRestaurantById } from '@/src/lib/database/restaurant';
import ReservationForm from '@/src/components/reservation_form';
import Header from '@/src/components/header';
import { useEffect, useState } from 'react';

export default function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [loading, setLoading] = useState(true);
    const [restaurant, setRestaurant] = useState({
        name: '',
        address: '',
        city: '',
        cuisine: '',
    });
    useEffect(() => {
        async function fetchData() {
            const result = await getRestaurantById(parseInt(id));
            setRestaurant(result);
            setLoading(false);
        }
        fetchData();
    },[]);

    if(loading)
        return <div>Loading...</div>;

    return (
        <div className="w-full">
            <div className="px-10 py-4 flex flex-col">
                <div className="flex flex-row">
                    <div className="self-start py-1">
                        <img
                            src='/restaurant_template_image.jpg'
                            alt='Restaurant Image template'
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
                <div>
                    <ReservationForm restaurant_id={parseInt(id)}/>
                </div>
            </div>
        </div>
    );
}