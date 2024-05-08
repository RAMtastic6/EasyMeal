"use client";
import React, { useState } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

export default function RestaurantSearch({ cuisines, cities }: { cuisines: string[], cities: string[] }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const handleSearch = useDebouncedCallback((nameRestaurant: string, date: string, city: string, cuisine: string) => {
    console.log('Searching...', nameRestaurant, date, city, cuisine);
    const params = new URLSearchParams(searchParams);
    if (date) {
      params.set('date', date);
    } else {
      params.delete('date');
    }
    if (nameRestaurant) {
      params.set('nameRestaurant', nameRestaurant);
    } else {
      params.delete('nameRestaurant');
    }
    if (city) {
      params.set('city', city);
    } else {
      params.delete('city');
    }
    if (cuisine) {
      params.set('cuisine', cuisine);
    } else {
      params.delete('cuisine');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);
  const [date, setDate] = useState('');
  const [nameRestaurant, setNameRestaurant] = useState('');
  const [city, setCity] = useState('');
  const [cuisine, setCuisine] = useState('');

  //const cuisines = getCuisines();
  //const cities = ['Milano', 'Roma', 'Napoli', 'Torino', 'Bologna', 'Firenze', 'Palermo', 'Genova', 'Bari', 'Catania'];

  return (
    <div>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
        <div className="relative">
          <input
            type="text"
            id="Search"
            data-testid={"InputNomeRistorante"}
            placeholder="Inserisci il nome di un ristorante..."
            className="w-full rounded-md border-2 border-orange-700 py-2.5 pe-10 shadow-sm sm:text-sm pl-[14px]"
            value={nameRestaurant}
            onChange={(e) => {
              setNameRestaurant(e.target.value);
              handleSearch(e.target.value, date, city, cuisine);
            }}
          />

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            id="Search"
            placeholder="Inserisci una città..."
            list='citySuggestions'
            className="w-full rounded-md border-2 border-orange-700 py-2.5 pe-10 shadow-sm sm:text-sm pl-[14px]"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              handleSearch(nameRestaurant, date, e.target.value, cuisine);
            }}
          />
          <datalist id="citySuggestions">
            {cities.map((city) => (
              <option key={city} value={city} />
            ))}
          </datalist>

          <span className="absolute inset-y-0 end-0 grid w-10 place-content-center">
            <button type="button" className="text-gray-600 hover:text-gray-700">

              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </span>
        </div>

        <div className="relative">
          <input
            type="date"
            className="w-full rounded-md border-2 border-orange-700 py-2.5 pe-2 shadow-sm sm:text-sm pl-[14px] text-gray-600"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              handleSearch(nameRestaurant, e.target.value, city, cuisine);
            }}
            min={new Date().toISOString().split('T')[0]}
          />
        </div>

        <div className="relative">
          <select
            name="HeadlineAct"
            id="HeadlineAct"
            className="w-full rounded-md border-2 border-orange-700 py-2.5 pe-2 shadow-sm sm:text-sm pl-[14px] text-gray-600"
            value={cuisine}
            onChange={(e) => {
              setCuisine(e.target.value);
              handleSearch(nameRestaurant, date, city, e.target.value);
            }}
          >
            <option value="">Seleziona la tipologia di cucina...</option>
            {cuisines.map((cuisine) => (
              <option key={cuisine} value={cuisine}>{cuisine}</option>
            ))}
          </select>
        </div>
        <div>
          <a
            className="underline text-blue-500 hover:text-blue-700 transition-colors cursor-pointer"
            onClick={() => {
              setNameRestaurant('');
              setDate('');
              setCity('');
              setCuisine('');
              handleSearch('', '', '', '');
            }}>
            Resetta i filtri
          </a>
        </div>
      </form>
    </div>
  );
}