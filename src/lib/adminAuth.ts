import { cookies } from 'next/headers'
import { API_URL } from './api'
import { ADMIN_COOKIE } from './constants'
import type { AdminUser } from './types'

export { ADMIN_COOKIE, ADMIN_COOKIE_MAX_AGE } from './constants'

export async function readAdminToken(): Promise<string | null> {
  const store = await cookies()

  return store.get(ADMIN_COOKIE)?.value ?? null
}

/**
 * Verifies the current admin cookie against the API and returns the user.
 * Returns `null` when the cookie is missing, invalid, or expired.
 *
 * This is the server-side authorization check used by admin layouts and
 * pages; Proxy only performs an optimistic cookie-presence redirect.
 */
export async function getAdminSession(): Promise<AdminUser | null> {
  const token = await readAdminToken()

  if (!token) return null

  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    })

    if (!response.ok) return null

    const body = await response.json().catch(() => null)

    return (body?.data?.user as AdminUser | undefined) ?? null
  } catch {
    return null
  }
}
