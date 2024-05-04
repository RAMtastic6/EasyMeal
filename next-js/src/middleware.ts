import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptToken } from './lib/session'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/create_reservation', '/create_reservation/\\d+/view',
  'order/\\d+/view'];
const publicRoutes = ['/login', '/signup', '/']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  console.log(path);
  const isProtectedRoute = protectedRoutes.some((route) => new RegExp(route).test(path))
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value
  const session = await decryptToken(cookie)
  // 5. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
 
  // 6. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/create_reservation')
  ) {
    return NextResponse.redirect(new URL('/create_reservation', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}