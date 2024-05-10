'use server';
import 'server-only';
import { cookies } from 'next/headers'
import { decryptToken } from './session';
import { redirect } from 'next/navigation';
import { cache } from 'react';


export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value;
    const session = await decryptToken(cookie);
    if(!session?.id) {
        redirect('/login');
    }

    return { isAuth: true, id: session.id as number}
});