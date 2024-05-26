'use client';
import React, { useState } from 'react';

export default function PaymentMethod() {
  const [selectedOption, setSelectedOption] = useState('AllaRomana');

  const handleOptionChange = (option: string) => {
    setSelectedOption(option);
  };

  return (
    <>
    <div className="w-full flex justify-center">Totale: 20€</div>
      <div className="w-full flex justify-center">
        <div className="max-w-md w-full px-8 py-4 flex flex-col space-y-4 bg-white rounded-lg shadow-md">
          <div className="text-lg font-semibold text-center">Scegli come vuoi dividere il conto:</div>

          <div>
            <label
              htmlFor="AllaRomana"
              className={`flex cursor-pointer items-center justify-between rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 ${selectedOption === 'AllaRomana' ? 'border-orange-500 ring-1 ring-orange-500' : ''
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
          </div>

          <div>
            <label
              htmlFor="Ognuno"
              className="flex items-center justify-between rounded-lg bg-gray-100 p-4 text-sm font-medium shadow-sm"
            >
              <p className="text-gray-700">Ognun per sé (Coming Soon)</p>
              <input
                type="radio"
                className="sr-only"
                id="Ognuno"
                disabled
              />
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
