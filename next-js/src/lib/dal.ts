'use server';
import { cookies } from 'next/headers'
import { decryptToken } from './session';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { getUserById } from './database/user';


export const verifySession = cache(async () => {
  const cookie = cookies().get('session')?.value;
  const session = await decryptToken(cookie);
  if (!(session?.id)) {
    redirect('/login');
  }
  return { isAuth: true, userId: session.id as number }
});

export const getUser = cache(async () => {
  const session = await verifySession()
  if (!session) return null

  try {
    const user = await getUserById(session.userId);
    return user
  } catch (error) {
    console.log('Failed to fetch user')
    return null
  }
})