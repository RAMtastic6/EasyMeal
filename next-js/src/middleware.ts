import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decodeToken } from './lib/database/authentication';
 
// 1. Specify protected and public routes
const protectedRoutes = [
  '/create_reservation', 
  '/create_reservation/\\d+/view', 
  'order/\\d+/view',
  'user/reservations_list',
  'user/reservations_list/\\d+/view',
  'admin/reservations_list',
  'admin/reservations_list/\\d+/view',
  'order/\\d+',
  'order/\\d+/checkout',
  'notifications'
];
const publicRoutes = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/verify-email'];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => new RegExp(route).test(path))
  const isPublicRoute = publicRoutes.includes(path);
  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value;
  const session = await decodeToken(cookie ?? '');

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !(session?.id)) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = `callbackUrl=${encodeURIComponent(req.nextUrl.pathname)}`;
    return NextResponse.redirect(url)
  }

  if(req.nextUrl.pathname === '/login' && session?.id) {
    return NextResponse.redirect(new URL('/create_reservation', req.nextUrl));
  }
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}