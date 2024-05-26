'use client';
import React, { useState } from 'react';
import Link from 'next/link';

export default function PaymentMethod({ params }: { params: { number: string } }) {
  const [selectedOption, setSelectedOption] = useState('AllaRomana');
  const [individualPrice, setIndividualPrice] = useState(0);

  const handleOptionChange = (option: any) => {
    setSelectedOption(option);
    calculateIndividualPrice(option);
  };

  const calculateIndividualPrice = (option: any) => {
    // Calcola il prezzo individuale in base all'opzione selezionata
    if (option === 'AllaRomana') {
    } else if (option === 'Ognuno') {
      // Aggiungi qui la logica per calcolare il prezzo individuale
    }
  };

  const price = 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <header className="text-center">
            <h1 className="text-xl font-bold text-orange-950 sm:text-3xl">Il vostro ordine</h1>
          </header>

          <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6 mt-8">
            <div className="text-xl font-semibold text-gray-800 text-center border-b pb-4">Totale: €{price}</div>
            <div className="text-lg font-semibold text-center">Scegli come vuoi dividere il conto:</div>
            <div className="space-y-4">
              <label
                htmlFor="AllaRomana"
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 text-sm font-medium shadow-sm transition ${selectedOption === 'AllaRomana' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-100'
                  }`}
                onClick={() => handleOptionChange('AllaRomana')}
              >
                <p className="text-gray-700">Alla romana</p>
                <input
                  type="radio"
                  className="sr-only"
                  id="AllaRomana"
                  checked={selectedOption === 'AllaRomana'}
                  onChange={() => handleOptionChange('AllaRomana')}
                />
              </label>
              <label
                htmlFor="Ognuno"
                className={`flex cursor-pointer items-center justify-between rounded-lg border p-4 text-sm font-medium shadow-sm transition ${selectedOption === 'Ognuno' ? 'border-orange-500 ring-2 ring-orange-500' : 'border-gray-100'
                  }`}
                onClick={() => handleOptionChange('Ognuno')}
              >
                <p className="text-gray-700">Ognuno per sé</p>
                <input
                  type="radio"
                  className="sr-only"
                  id="Ognuno"
                  checked={selectedOption === 'Ognuno'}
                  onChange={() => handleOptionChange('Ognuno')}
                />
              </label>
            </div>

            {/* Sezione per visualizzare la tua parte da pagare */}
            <div className="text-lg font-semibold text-center">La tua parte: €{individualPrice}</div>

            <div className="flex justify-center mt-4">
              <div className="sm:flex sm:gap-4">
                <Link className="inline-block rounded bg-orange-950 px-8 py-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring" href={`${params.number}/checkout/`}> Checkout </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
