'use server';
import { jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { login } from './database/user';

const secretKey = 'sgroi';
const encodeKey = new TextEncoder().encode(secretKey);

export async function decryptToken(token: string | undefined) {
  if (!token) {
    return null;
  }
  try {
    const { payload } = await jwtVerify(token, encodeKey,
      { algorithms: ['HS256'] });
    return payload;
  } catch (error) {
    return null;
  }
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