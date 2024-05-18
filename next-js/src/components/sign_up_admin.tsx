'use client'

import { useFormState } from 'react-dom';
import { validateSignUpAdmin } from '../actions/validateSignUpAdmin';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Day, daysOfWeek, DaySchedule } from '@/src/lib/types/definitions';

const initialState = {
  message: '',
}

export default function SignupAdmin() {
  const router = useRouter();
  const [state, formAction] = useFormState(validateSignUpAdmin, initialState)
  const [schedule, setSchedule] = useState<Record<Day, DaySchedule>>(
    daysOfWeek.reduce((acc, day) => {
      acc[day] = { isOpen: false, hours: { open: '', close: '' } };
      return acc;
    }, {} as Record<Day, DaySchedule>)
  );

  const handleDayChange = (day: Day, isOpen: boolean) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], isOpen }
    }));
  };

  const handleTimeChange = (day: Day, field: 'open' | 'close', value: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], hours: { ...prev[day].hours, [field]: value } }
    }));
  };

  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-color-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1
            className="text-center text-2xl font-bold text-white mx-auto h-10 w-auto"
          > EasyMeal </h1>
          <div className="container mx-auto bg-white mt-4 p-10 rounded-md border">
            <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-red-950">
              Registrati come ristoratore
            </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action={formAction} className="max-w-md mx-auto space-y-6" method="POST">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email personale *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Email personale..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="nome" className="block text-sm font-medium text-gray-700">Nome *</label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Nome..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="cognome" className="block text-sm font-medium text-gray-700">Cognome *</label>
                  <input
                    id="cognome"
                    name="cognome"
                    type="text"
                    placeholder="Cognome..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label htmlFor="nome-ristorante" className="block text-sm font-medium text-gray-700">Nome Ristorante *</label>
                  <input
                    id="nome-ristorante"
                    name="nome-ristorante"
                    type="text"
                    placeholder="Nome Ristorante..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="città" className='block text-sm font-medium leading-6 text-gray-900'>Città *</label>
                  <input
                    id="città"
                    name="città"
                    type="text"
                    placeholder="Città..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="indirizzo" className='block text-sm font-medium leading-6 text-gray-900'>Indirizzo *</label>
                  <input
                    id="indirizzo"
                    name="indirizzo"
                    type="text"
                    placeholder="Indirizzo..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="descrizione" className='block text-sm font-medium leading-6 text-gray-900'>Descrizione </label>
                  <textarea
                    id="descrizione"
                    name="descrizione"
                    placeholder="Descrizione..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="orari" className='block text-sm font-medium leading-6 text-gray-900'>Orari</label>
                  {daysOfWeek.map(day => (
                    <div key={day}>
                      <label>
                        <input
                          type="checkbox"
                          checked={schedule[day].isOpen}
                          onChange={e => handleDayChange(day, e.target.checked)}
                        />
                        {day}
                      </label>
                      {schedule[day].isOpen && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor={day + '-apertura'} className='block text-sm font-medium leading-6 text-gray-900'>
                              Apertura:
                              <input
                                id={day + '-apertura'}
                                name={day + '-apertura'}
                                type="time"
                                value={schedule[day].hours.open}
                                onChange={e => handleTimeChange(day, 'open', e.target.value)}
                                className='pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"'
                              />
                            </label>
                          </div>
                          <div>
                            <label htmlFor={day + '-chiusura'} className='block text-sm font-medium leading-6 text-gray-900'>
                              Chiusura:
                              <input
                                id={day + '-chiusura'}
                                name={day + '-chiusura'}
                                type="time"
                                value={schedule[day].hours.close}
                                onChange={e => handleTimeChange(day, 'close', e.target.value)}
                                className='pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                              />
                            </label>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-2">
                  <label htmlFor="coperti" className='block text-sm font-medium leading-6 text-gray-900'>Coperti *</label>
                  <input
                    id="coperti"
                    name="coperti"
                    type="number"
                    placeholder="Coperti..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="numero" className='block text-sm font-medium leading-6 text-gray-900'>Numero di telefono *</label>
                  <input
                    id="numero"
                    name="numero"
                    type="text"
                    placeholder="Numero..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="email-ristorante" className='block text-sm font-medium leading-6 text-gray-900'>Email del ristorante *</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Email del ristorante..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="cucina" className='block text-sm font-medium leading-6 text-gray-900'>Tipologia di cucina *</label>
                  <input
                    id="cucina"
                    name="cucina"
                    type="text"
                    placeholder="Cucina..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="password" className='block text-sm font-medium leading-6 text-gray-900'>Password *</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div className="mt-2">
                  <label htmlFor="password_confirmation" className='block text-sm font-medium leading-6 text-gray-900'>Conferma Password *</label>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password..."
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <input
                    type="submit"
                    value="Sign up"
                    className="flex w-full justify-center rounded bg-orange-950 px-12 py-3 text-sm font-medium text-white hover:bg-orange-900 focus:outline-none focus:ring"
                  />
                </div>
              </form>
              {state?.message && <p className="mt-4 text-center text-red-500">{state?.message}</p>}
            </div>
            <div>
              <p className="mt-4 text-center text-sm font-medium text-gray-900">
                Hai già un account? <a href="/login" className="text-orange-950 hover:text-orange-900">Accedi</a>
              </p>
            </div>
          </div>
        </div >
      </div >
    </>
  );
}
/*
<label htmlFor="lunedi-apertura" className='block text-sm font-medium leading-6 text-gray-900'>Lunedì Apertura *</label>
<input
  id="lunedi-apertura"
  name="lunedi-apertura"
  type="time"
  placeholder="Orario..."
  required
  className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
/>
<div>
  <label htmlFor="lunedi-chiusura" className='block text-sm font-medium leading-6 text-gray-900'>Lunedì Chiusura *</label>
  <input
    id="lunedi-chiusura"
    name="lunedi-chiusura"
    type="time"
    placeholder="Orario..."
    required
    className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
  />
</div>
*/