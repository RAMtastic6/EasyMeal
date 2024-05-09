'use server';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { Endpoints } from './database/endpoints';

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
    //TODO: Handle error
    return null;
  }
}

export async function createSession(email: string, password: string) {
  let token;
  try {
    const response = await fetch(Endpoints.user + "login", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    if (response.status != 200) {
      return false;
    }
    token = (await response.json()).token;
  } catch (error) {
    //TODO: Handle error
    console.log('Error:', error);
    return false;
  }
  cookies().set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    expires: new Date(Date.now() + 1000 * 60 * 60),
    path: '/',
  });
  return true;
}