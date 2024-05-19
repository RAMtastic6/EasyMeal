'use server';
import { cookies } from 'next/headers';
import { decodeToken, login } from './database/authentication';

export async function decryptToken(token: string | undefined) {
  if (!token) {
    return null;
  }
  return await decodeToken(token);
}

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
  const payload = await decryptToken(session)

  if (!session || !payload) {
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