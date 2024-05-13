'use client'

import { useFormState, useFormStatus } from 'react-dom';
import { validateSignUpAdmin } from '../actions/validateSignUpAdmin';

const initialState = {
  message: '',
}

export default function SignupAdmin() {
  //const { pending } = useFormStatus();
  const [state, formAction] = useFormState(validateSignUpAdmin, initialState)
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
              <form action={formAction}>
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
  );
}