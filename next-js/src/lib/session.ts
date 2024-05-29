'use server';
import { cookies } from 'next/headers';
import { decodeToken, login } from './database/authentication';
import { redirect } from 'next/navigation';

export async function createSession(email: string, password: string) {
  const token: string = await login(email, password);
  if (!token) {
    return false;
  }
  cookies().set('session', token, {
    secure: true,
    httpOnly: true,
    expires: new Date(Date.now() + 60 * 60 * 1000),
    sameSite: 'strict',
    path: '/',
  });
  return true;
}

//TODO: Implement this function
export async function updateSession() {
  const session = cookies().get('session')?.value
  if (!session) {
    return null
  }
  const payload = await decodeToken(session)
  if (!payload) {
    return null
  }
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  cookies().set('session', session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: 'lax',
    path: '/',
  })
}

 
export async function deleteSession() {
  cookies().delete('session')
}