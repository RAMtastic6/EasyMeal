'use server';
import 'server-only'

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers';
import { Endpoints } from './database/endpoints';

const secretKey = 'sgroi';
const encodeKey = new TextEncoder().encode(secretKey);

export async function decryptToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, encodeKey, { algorithms: ['HS256'] });
        return payload;
    } catch (error) {
        console.log('Error decrypting token', error);
    }
}

export async function createSession(email: string, hashedPassword: string) {
    let token;
    try {
        const response = await fetch(Endpoints.customer+"login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email, password: hashedPassword }),
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