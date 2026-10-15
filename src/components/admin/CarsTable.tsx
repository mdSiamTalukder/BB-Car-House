'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  CarFront,
  Eye,
  EyeOff,
  Pencil,
  Plus,
  Search,
  Star,
  Trash2,
} from 'lucide-react'
import { adminFetch } from '../../lib/adminClient'
import type { CarDto } from '../../lib/types'
import {
  CAR_STATUS_LABELS,
  formatPrice,
} from '../../lib/format'
import {
  AdminPageHeader,
  EmptyState,
  ErrorState,
  Skeleton,
} from './ui'

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    AVAILABLE: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300',
    RESERVED: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    SOLD: 'bg-red-500/15 text-red-700 dark:text-red-300',
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? 'bg-base-200'
      }`}
    >
      {CAR_STATUS_LABELS[status] ?? status}
    </span>
  )
}

export default function CarsTable() {
  const [cars, setCars] = useState<CarDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [visibility, setVisibility] = useState('all')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      const response = await adminFetch<{ cars: CarDto[] }>(
        'cars?pageSize=100&includeUnpublished=true&sort=newest',
      )
      if (!active) return

      if (!response.ok || !response.data) {
        setError(response.message || 'Unable to load cars.')
        setCars([])
      } else {
        setCars(response.data.cars)
        setError('')
      }

      setLoading(false)
    }

    void load()

    return () => {
      active = false
    }
  }, [reloadKey])

  function reload() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return cars.filter((car) => {
      const matchesSearch =
        !query ||
        car.title.toLowerCase().includes(query) ||
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' || car.status === statusFilter

      const matchesVisibility =
        visibility === 'all' ||
        (visibility === 'published' && car.isPublished) ||
        (visibility === 'hidden' && !car.isPublished)

      return matchesSearch && matchesStatus && matchesVisibility
    })
  }, [cars, search, statusFilter, visibility])

  async function togglePublished(car: CarDto) {
    setBusyId(car.id)

    const response = await adminFetch<{ car: CarDto }>(`cars/${car.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ isPublished: !car.isPublished }),
    })

    if (response.ok && response.data) {
      setCars((current) =>
        current.map((item) =>
          item.id === car.id ? response.data!.car : item,
        ),
      )
    } else {
      setError(response.message || 'Could not update visibility.')
    }

    setBusyId(null)
  }

  async function remove(car: CarDto) {
    const confirmed = window.confirm(
      `Delete "${car.title}"? This cannot be undone.`,
    )

    if (!confirmed) return

    setBusyId(car.id)

    const response = await adminFetch<null>(`cars/${car.id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      setCars((current) => current.filter((item) => item.id !== car.id))
    } else {
      setError(response.message || 'Could not delete the car.')
    }

    setBusyId(null)
  }

  return (
    <div>
      <AdminPageHeader
        title="Cars"
        description="Manage your inventory and control what appears on the website."
        action={
          <Link href="/admin/cars/new" className="btn btn-primary">
            <Plus size={17} aria-hidden="true" />
            Add Car
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="input input-bordered flex items-center gap-2 bg-base-100 sm:col-span-2">
          <Search size={18} className="opacity-60" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title, brand or model..."
            className="grow bg-transparent outline-none"
            aria-label="Search cars"
          />
        </label>

        <select
          className="select select-bordered bg-base-100"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="AVAILABLE">Available</option>
          <option value="RESERVED">Reserved</option>
          <option value="SOLD">Sold</option>
        </select>

        <select
          className="select select-bordered bg-base-100"
          value={visibility}
          onChange={(event) => setVisibility(event.target.value)}
          aria-label="Filter by visibility"
        >
          <option value="all">All visibility</option>
          <option value="published">Published</option>
          <option value="hidden">Hidden</option>
        </select>
      </div>

      {error && (
        <div className="mb-5">
          <ErrorState message={error} onRetry={reload} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={CarFront}
          title={cars.length === 0 ? 'No cars yet' : 'No matching cars'}
          description={
            cars.length === 0
              ? 'Add your first vehicle to get started.'
              : 'Try changing your search or filters.'
          }
          action={
            cars.length === 0 ? (
              <Link href="/admin/cars/new" className="btn btn-primary btn-sm">
                <Plus size={16} aria-hidden="true" />
                Add Car
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th>Car</th>
                <th>Category</th>
                <th>Price</th>
                <th>Status</th>
                <th>Visibility</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((car) => (
                <tr key={car.id} className={busyId === car.id ? 'opacity-60' : ''}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar">
                        <div className="h-12 w-16 rounded-lg bg-base-200">
                          {car.images[0] ? (
                            <img
                              src={car.images[0].url}
                              alt=""
                              className="h-full w-full rounded-lg object-cover"
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <Link
                          href={`/admin/cars/${car.id}`}
                          className="flex items-center gap-1.5 font-semibold hover:text-emerald-700"
                        >
                          {car.title}
                          {car.featured && (
                            <Star
                              size={14}
                              className="fill-amber-400 text-amber-400"
                              aria-label="Featured"
                            />
                          )}
                        </Link>
                        <p className="text-xs text-base-content/50">
                          {car.brand} {car.model} · {car.year}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap">
                    {car.category ?? '—'}
                  </td>
                  <td className="whitespace-nowrap">
                    {formatPrice(car.price)}
                  </td>
                  <td>{statusBadge(car.status)}</td>
                  <td>
                    <button
                      type="button"
                      onClick={() => togglePublished(car)}
                      disabled={busyId === car.id}
                      className={`btn btn-xs gap-1 ${
                        car.isPublished ? 'btn-success' : 'btn-ghost border border-base-300'
                      }`}
                      aria-pressed={car.isPublished}
                      title={
                        car.isPublished
                          ? 'Click to hide from website'
                          : 'Click to publish'
                      }
                    >
                      {car.isPublished ? (
                        <>
                          <Eye size={13} aria-hidden="true" />
                          Published
                        </>
                      ) : (
                        <>
                          <EyeOff size={13} aria-hidden="true" />
                          Hidden
                        </>
                      )}
                    </button>
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/cars/${car.id}`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label={`Edit ${car.title}`}
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => remove(car)}
                        disabled={busyId === car.id}
                        className="btn btn-ghost btn-square btn-sm text-red-600 hover:bg-red-500/10 dark:text-red-400"
                        aria-label={`Delete ${car.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
