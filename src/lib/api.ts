import type {
  CarCardData,
  CarDto,
  CarFacets,
  Pagination,
} from './types'
import { FALLBACK_CAR_IMAGE } from './constants'

/**
 * Server-only helper for talking to the Express API (`server/`).
 *
 * This module reads the server-only `API_URL` variable, so it must never be
 * imported from a Client Component. Only import the plain types from
 * `./types` on the client.
 */

export const API_URL = process.env.API_URL ?? 'http://localhost:5000'

export { FALLBACK_CAR_IMAGE }

type ApiEnvelope<T> = {
  success: boolean
  message: string
  data: T
  meta?: { pagination?: Pagination }
}

export type ApiResult<T> = {
  ok: boolean
  status: number
  data: T | null
  pagination?: Pagination
  message: string
}

async function request<T>(
  path: string,
  init?: RequestInit,
): Promise<ApiResult<T>> {
  const url = `${API_URL}${path}`

  try {
    const response = await fetch(url, {
      ...init,
      // The public site always reflects the latest inventory.
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
        ...(init?.headers ?? {}),
      },
    })

    const body = (await response.json().catch(() => null)) as
      | ApiEnvelope<T>
      | null

    return {
      ok: response.ok && body?.success !== false,
      status: response.status,
      data: body?.data ?? null,
      pagination: body?.meta?.pagination,
      message: body?.message ?? response.statusText,
    }
  } catch {
    // The API may be down during a build or local setup; callers decide how
    // to present that to the visitor.
    return {
      ok: false,
      status: 0,
      data: null,
      message: 'Unable to reach the BB Car House API.',
    }
  }
}

export type CarListParams = {
  page?: number
  pageSize?: number
  search?: string
  category?: string
  brand?: string
  status?: string
  featured?: boolean
  minPrice?: number
  maxPrice?: number
  minYear?: number
  maxYear?: number
  sort?: string
}

function toQueryString(params: Record<string, unknown>): string {
  const search = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, String(value))
  }

  const query = search.toString()

  return query ? `?${query}` : ''
}

export async function fetchPublishedCars(
  params: CarListParams = {},
): Promise<{ cars: CarDto[]; pagination?: Pagination; ok: boolean }> {
  const query = toQueryString({ pageSize: 100, ...params })
  const result = await request<{ cars: CarDto[] }>(`/api/cars${query}`)

  return {
    cars: result.data?.cars ?? [],
    pagination: result.pagination,
    ok: result.ok,
  }
}

export async function fetchCarBySlug(
  slug: string,
): Promise<CarDto | null> {
  const result = await request<{ car: CarDto }>(
    `/api/cars/slug/${encodeURIComponent(slug)}`,
  )

  return result.data?.car ?? null
}

export async function fetchCarFacets(): Promise<CarFacets> {
  const result = await request<CarFacets>('/api/cars/categories')

  return result.data ?? { categories: [], brands: [] }
}

/** Formats a stored mileage (kilometres) for display. */
export function formatMileage(mileage: number): string {
  return `${mileage.toLocaleString('en-BD')} km`
}

/** Maps a backend car into the shape the public `CarCard` renders. */
export function toCardData(car: CarDto): CarCardData {
  return {
    id: car.id,
    slug: car.slug,
    name: car.title,
    year: car.year,
    price: car.price,
    mileage: formatMileage(car.mileage),
    fuel: car.fuelType ?? 'N/A',
    transmission: car.transmission ?? 'N/A',
    category: car.category ?? 'Other',
    image: car.images[0]?.url ?? FALLBACK_CAR_IMAGE,
    featured: car.featured,
    status: car.status,
  }
}

/** Normalises the list order used across the public pages: featured first. */
export function sortFeaturedFirst(cars: CarDto[]): CarDto[] {
  return [...cars].sort(
    (a, b) => Number(b.featured) - Number(a.featured),
  )
}
