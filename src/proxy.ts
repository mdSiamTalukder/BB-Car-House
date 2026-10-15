import { NextResponse, type NextRequest } from 'next/server'
import { ADMIN_COOKIE } from '@/lib/constants'

/**
 * Optimistic route guard for `/admin`.
 *
 * Proxy only checks that the session cookie is present — it never verifies the
 * JWT (the API is the source of truth). Every admin page additionally calls
 * `getAdminSession()` server-side, and the API enforces authorization on every
 * request, so a forged cookie cannot grant access to data.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(request.cookies.get(ADMIN_COOKIE)?.value)
  const isLoginRoute = pathname === '/admin/login'

  if (isLoginRoute) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }

    return NextResponse.next()
  }

  if (!hasSession) {
    const loginUrl = new URL('/admin/login', request.url)

    if (pathname !== '/admin') {
      loginUrl.searchParams.set('from', pathname)
    }

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}
