'use client'

import { useFormState } from 'react-dom'
import { validateSignUp } from '@/src/actions/validateSignUp'

const initialState = {
  message: '',
}

export default function Signup() {
  const [state, formAction] = useFormState(validateSignUp, initialState);
  
  const actionUrl = typeof formAction === 'string' ? formAction : '';
  
  return (
    <>
      <div className="flex flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-color-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h1
            className="text-center text-2xl font-bold text-white mx-auto h-10 w-auto"
          > EasyMeal </h1>
          <div className="container mx-auto bg-white mt-4 p-10 rounded-md border">
            <h2 className="text-center text-xl font-bold leading-9 tracking-tight text-red-950">
              Registrati
            </h2>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
              <form action={actionUrl}>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    //type="email"
                    autoComplete="email"
                    placeholder="Indirizzo email..."
                    data-testid={"InputEmail"}
                    required
                    className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>Nome</label>
                <div className="mt-2">
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    placeholder="Nome..."
                    data-testid={"InputNome"}
                    required
                    className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label className='block text-sm font-medium leading-6 text-gray-900'>Cognome</label>
                <div className="mt-2">
                  <input
                    id="cognome"
                    name="cognome"
                    type="text"
                    placeholder="Cognome..."
                    data-testid={"InputCognome"}
                    required
                    className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label htmlFor="password" className='block text-sm font-medium leading-6 text-gray-900'>Password</label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password..."
                    data-testid={"InputPassword"}
                    required
                    className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
                <label htmlFor="password_confirmation" className='block text-sm font-medium leading-6 text-gray-900'>Password confirmation</label>
                <div className="mt-2">
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Password..."
                    data-testid={"InputConfirmPassword"}
                    required
                    className="pl-[14px] block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
          </div>
        </div>
      </div>
    </>
  )
}
