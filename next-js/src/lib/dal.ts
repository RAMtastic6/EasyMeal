'use server';
import 'server-only'

import { cookies } from 'next/headers'
import { decryptToken } from './session';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getCustomerById } from './database/customer';


export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value;
    const session = await decryptToken(cookie);
    if(!session?.id) {
        redirect('/login');
    }

    return { isAuth: true, userId: session?.userId}
});

export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null
   
    try {
      const user = await getCustomerById(session.userId as number);
      return user
    } catch (error) {
      console.log('Failed to fetch user')
      return null
    }
  })