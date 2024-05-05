import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { decryptToken } from './lib/session'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/create_reservation', '/create_reservation/\\d+/view', 'order/\\d+/view'];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.some((route) => new RegExp(route).test(path))
 
  // 3. Decrypt the session from the cookie
  const cookie = cookies().get('session')?.value
  const session = await decryptToken(cookie)

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}