'use client'

import type { Pagination } from './types'

/**
 * Browser-side helper for admin data access.
 *
 * Requests go to the same-origin proxy route, which attaches the httpOnly
 * session cookie as a Bearer token. The browser never handles the JWT.
 */

type Envelope<T> = {
  success: boolean
  message: string
  data: T
  meta?: { pagination?: Pagination }
}

export type AdminResponse<T> = {
  ok: boolean
  status: number
  data: T | null
  message: string
  pagination?: Pagination
}

export async function adminFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<AdminResponse<T>> {
  const cleanPath = path.replace(/^\//, '')
  const body = init?.body
  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const headers = new Headers(init?.headers)
  headers.set('Accept', 'application/json')

  if (body != null && !isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  let response: Response

  try {
    response = await fetch(`/api/admin/proxy/${cleanPath}`, {
      ...init,
      headers,
    })
  } catch {
    return {
      ok: false,
      status: 0,
      data: null,
      message: 'Network error. Please check your connection and try again.',
    }
  }

  const parsed = (await response.json().catch(() => null)) as
    | Envelope<T>
    | null

  return {
    ok: response.ok && parsed?.success !== false,
    status: response.status,
    data: parsed?.data ?? null,
    message: parsed?.message ?? response.statusText,
    pagination: parsed?.meta?.pagination,
  }
}

/** Joins defined query params into a query string. */
export function buildQuery(params: Record<string, unknown>): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }

  const query = search.toString()

  return query ? `?${query}` : ''
}
