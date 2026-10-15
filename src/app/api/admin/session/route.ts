import { cookies } from 'next/headers'
import type { NextRequest } from 'next/server'
import { API_URL } from '@/lib/api'
import {
  ADMIN_COOKIE,
  ADMIN_COOKIE_MAX_AGE,
  getAdminSession,
} from '@/lib/adminAuth'

/**
 * Admin session endpoint.
 *
 * - `POST`   signs in against the Express API and stores the JWT in an
 *            httpOnly cookie so it is never readable by client JavaScript.
 * - `GET`    returns the currently signed-in admin (or 401).
 * - `DELETE` signs out by clearing the cookie.
 */

export async function POST(request: NextRequest) {
  const body = await request.text()

  let response: Response

  try {
    response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cache: 'no-store',
    })
  } catch {
    return Response.json(
      { success: false, message: 'The sign-in service is unavailable.' },
      { status: 503 },
    )
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    return Response.json(
      payload ?? { success: false, message: 'Sign in failed.' },
      { status: response.status },
    )
  }

  const token = payload?.data?.token

  if (typeof token !== 'string' || token.length === 0) {
    return Response.json(
      { success: false, message: 'Sign in failed: no token returned.' },
      { status: 502 },
    )
  }

  const cookieStore = await cookies()

  cookieStore.set({
    name: ADMIN_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: ADMIN_COOKIE_MAX_AGE,
  })

  return Response.json({
    success: true,
    message: 'Signed in successfully.',
    data: { user: payload.data.user },
  })
}

export async function GET() {
  const user = await getAdminSession()

  if (!user) {
    return Response.json(
      { success: false, message: 'Not authenticated.' },
      { status: 401 },
    )
  }

  return Response.json({ success: true, data: { user } })
}

export async function DELETE() {
  const cookieStore = await cookies()

  cookieStore.delete(ADMIN_COOKIE)

  return Response.json({ success: true, message: 'Signed out.' })
}
