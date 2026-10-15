import type { NextRequest } from 'next/server'
import { API_URL } from '@/lib/api'

/**
 * Public contact / enquiry endpoint.
 *
 * Keeps the browser on the same origin and forwards the submission to the
 * Express API, so the API base URL never needs to be exposed to the client.
 */
export async function POST(request: NextRequest) {
  const body = await request.text()

  try {
    const response = await fetch(`${API_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cache: 'no-store',
    })

    const payload = await response.json().catch(() => null)

    return Response.json(
      payload ?? {
        success: false,
        message: 'Unexpected response from the enquiry service.',
      },
      { status: response.status },
    )
  } catch {
    return Response.json(
      {
        success: false,
        message:
          'The enquiry service is unavailable right now. Please try again later.',
      },
      { status: 503 },
    )
  }
}
