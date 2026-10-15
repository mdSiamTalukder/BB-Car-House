import type { NextRequest } from 'next/server'
import { API_URL } from '@/lib/api'
import { readAdminToken } from '@/lib/adminAuth'

/**
 * Authenticated passthrough to the Express API.
 *
 * Admin pages call `/api/admin/proxy/<path>` on the same origin. The JWT is
 * read from the httpOnly cookie and attached as a Bearer token server-side,
 * so the browser never sees it. Authorization is always enforced by the API.
 */

async function handle(
  request: NextRequest,
  ctx: RouteContext<'/api/admin/proxy/[...path]'>,
) {
  const token = await readAdminToken()

  if (!token) {
    return Response.json(
      { success: false, message: 'Not authenticated.' },
      { status: 401 },
    )
  }

  const { path } = await ctx.params
  const search = request.nextUrl.search
  const target = `${API_URL}/api/${path.join('/')}${search}`

  const headers = new Headers()
  headers.set('Authorization', `Bearer ${token}`)

  const contentType = request.headers.get('content-type')
  if (contentType) headers.set('Content-Type', contentType)

  const accept = request.headers.get('accept')
  headers.set('Accept', accept ?? 'application/json')

  const hasBody = !['GET', 'HEAD'].includes(request.method)
  const body = hasBody ? await request.arrayBuffer() : undefined

  let response: Response

  try {
    response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: 'no-store',
      redirect: 'manual',
    })
  } catch {
    return Response.json(
      { success: false, message: 'The API is unreachable.' },
      { status: 503 },
    )
  }

  const responseBody = await response.arrayBuffer()

  return new Response(responseBody, {
    status: response.status,
    headers: {
      'Content-Type':
        response.headers.get('content-type') ?? 'application/json',
    },
  })
}

export const GET = handle
export const POST = handle
export const PATCH = handle
export const PUT = handle
export const DELETE = handle
