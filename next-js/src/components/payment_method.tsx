'use client';
import React, { useState, useEffect } from 'react';
import { getPartialBill, getRomanBill, getTotalBill } from '../lib/database/order';
import { verifySession } from '../lib/dal';

export default function PaymentMethod({ selectedOption, setSelectedOption, params }: { selectedOption: string, setSelectedOption: Function, params: number }) {
  const [individualPrice, setIndividualPrice] = useState(0);
  const [price, setPrice] = useState(0);

  useEffect(() => {
    calculateIndividualPrice(selectedOption);
    calculateTotalPrice();
  }, [selectedOption]);

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
    calculateIndividualPrice(option);
  };

  const calculateIndividualPrice = async (option: string) => {
    const session = await verifySession();
    try {
      if (option === 'AllaRomana') {
        const data = await getRomanBill({ customer_id: session.id, reservation_id: params });
        console.log('Roman Bill Data:', data);
        setIndividualPrice(data);
      } else if (option === 'Ognuno') {
        const data = await getPartialBill({ customer_id: session.id, reservation_id: params });
        console.log('Partial Bill Data:', data);
        setIndividualPrice(data);
      }
    } catch (error) {
      console.error('Error calculating individual price:', error);
    }
  };

  const calculateTotalPrice = async () => {
    try {
      const data = await getTotalBill({ reservation_id: params });
      console.log('Total Bill Data:', data);
      setPrice(data);
    } catch (error) {
      console.error('Error calculating total price:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mx-auto max-w-screen-xl px-4 py-5 sm:px-6 sm:py-5 lg:px-8">
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
          </div>
        </div>
      </div>
    </div>
  );
}
