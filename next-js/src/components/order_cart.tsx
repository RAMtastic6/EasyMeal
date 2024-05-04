'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getOrderByReservationId } from '@/app/lib/database/order';

export default function OrderCart() {
    const [selectedOption, setSelectedOption] = useState('AllaRomana');

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
    };

    return (
        <>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-3xl">
                    <header className="text-center">
                        <h1 className="text-xl font-bold text-orange-950 sm:text-3xl">Il vostro ordine</h1>
                    </header>

                    <div className="mt-8">
                        <ul className="space-y-4">
                            <li className="flex items-center gap-4">
                                <div className="flex place-content-center">
                                    <Image src="/caprese.png" alt="Immagine della caprese" width={75} height={75} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-900">Caprese</h3>
                                </div>

                                <div className="flex flex-1 items-center justify-end gap-2">
                                    <form>
                                        <label className="sr-only"> Quantity </label>

                                        <input
                                            type="number"
                                            min="1"
                                            value="1"
                                            className="h-8 w-12 rounded border-gray-200 bg-gray-50 p-0 text-center text-xs text-gray-600 [-moz-appearance:_textfield] focus:outline-none [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                                        />
                                    </form>

                                    <button className="text-gray-600 transition hover:text-red-600">
                                        <span className="sr-only">Remove item</span>

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
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </li>
                        </ul>

                        <div className="mt-8 flex justify-end border-t border-gray-100 pt-8">
                            <div className="w-screen max-w-lg space-y-4">
                                <dl className="space-y-0.5 text-sm text-gray-700">
                                    <div className="flex justify-between">
                                        <dt>Totale</dt>
                                        <dd>€100</dd>
                                    </div>

                                    <div className="flex justify-between !text-base font-medium">
                                        <dt>La tua parte</dt>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="AllaRomana"
                                            className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 ${selectedOption === 'AllaRomana' ? 'has-[:checked]:border-orange-700 has-[:checked]:ring-1 has-[:checked]:ring-orange-700' : ''}`}
                                            onClick={() => handleOptionChange('AllaRomana')}
                                        >
                                            <p className="text-gray-700">Alla romana</p>
                                            <p className="text-gray-900">50€</p>
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
                                            className={`flex cursor-pointer items-center justify-between gap-4 rounded-lg border border-gray-100 bg-white p-4 text-sm font-medium shadow-sm hover:border-gray-200 ${selectedOption === 'Ognuno' ? 'has-[:checked]:border-orange-700 has-[:checked]:ring-1 has-[:checked]:ring-orange-700' : ''}`}
                                            onClick={() => handleOptionChange('Ognuno')}
                                        >
                                            <p className="text-gray-700">Ognun per sé</p>
                                            <p className="text-gray-900">35€</p>
                                            <input
                                                type="radio"
                                                className="sr-only"
                                                id="Ognuno"
                                                checked={selectedOption === 'Ognuno'}
                                                onChange={() => handleOptionChange('Ognuno')}
                                            />
                                        </label>
                                    </div>
                                </dl>

                                <div className="flex justify-end">
                                    <div className="sm:flex sm:gap-4">
                                        <Link className="inline-block rounded bg-orange-950 px-8 py-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring"
                                            href="#"> Checkout </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}