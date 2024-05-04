import 'server-only';

import { cache } from 'react';
import { cookies } from 'next/headers'
import { decryptToken } from './session';
import { redirect } from 'react-router-dom';

export const verifySession = cache(async () => {
    const cookie = cookies().get('session')?.value;
    const session = await decryptToken(cookie ?? '');
    if(!session?.userId) {
        redirect('/login');
    }

    return { isAuth: true, userId: session?.userId}
});