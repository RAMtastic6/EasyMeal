'use server';
import 'server-only';
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { decodeToken } from './database/authentication';


export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value;
    if(!cookie) redirect('/login');
    const session = await decodeToken(cookie);
    if(!session?.id) {
        redirect('/login');
    }
    return { isAuth: true, id: session.id as number}
});