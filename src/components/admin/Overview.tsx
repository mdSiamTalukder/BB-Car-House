'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  CarFront,
  CheckCircle2,
  EyeOff,
  Mail,
  MessageSquare,
  Plus,
  Sparkles,
} from 'lucide-react'
import { adminFetch } from '../../lib/adminClient'
import type { DashboardStats } from '../../lib/types'
import { formatDate, formatPrice, INQUIRY_STATUS_LABELS } from '../../lib/format'
import {
  AdminPageHeader,
  EmptyState,
  ErrorState,
  Skeleton,
  StatCard,
} from './ui'

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    NEW: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    CONTACTED: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    CLOSED: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300',
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
        styles[status] ?? 'bg-base-200'
      }`}
    >
      {INQUIRY_STATUS_LABELS[status] ?? status}
    </span>
  )
}

export default function Overview() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      const response = await adminFetch<DashboardStats>('admin/dashboard')
      if (!active) return

      if (!response.ok || !response.data) {
        setError(response.message || 'Unable to load dashboard data.')
        setStats(null)
      } else {
        setStats(response.data)
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

  return (
    <div>
      <AdminPageHeader
        title="Overview"
        description="A snapshot of your inventory and customer enquiries."
        action={
          <Link href="/admin/cars/new" className="btn btn-primary">
            <Plus size={17} aria-hidden="true" />
            Add Car
          </Link>
        }
      />

      {loading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-28" />
            ))}
          </div>
          <Skeleton className="h-64" />
        </div>
      )}

      {!loading && error && <ErrorState message={error} onRetry={reload} />}

      {!loading && !error && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={CarFront}
              label="Total Cars"
              value={stats.cars.total}
              hint={`${stats.cars.published} published`}
            />
            <StatCard
              icon={CheckCircle2}
              label="Published"
              value={stats.cars.published}
              tone="success"
              hint="Visible on the website"
            />
            <StatCard
              icon={EyeOff}
              label="Unpublished"
              value={stats.cars.unpublished}
              tone="warning"
              hint="Hidden from the website"
            />
            <StatCard
              icon={Sparkles}
              label="Featured"
              value={stats.cars.featured}
              tone="info"
              hint={`${formatPrice(stats.cars.inventoryValue)} inventory value`}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={MessageSquare}
              label="Total Enquiries"
              value={stats.inquiries.total}
            />
            <StatCard
              icon={MessageSquare}
              label="New"
              value={stats.inquiries.new}
              tone="info"
            />
            <StatCard
              icon={MessageSquare}
              label="Contacted"
              value={stats.inquiries.contacted}
              tone="warning"
            />
            <StatCard
              icon={CheckCircle2}
              label="Response Rate"
              value={`${stats.inquiries.responseRate}%`}
              tone="success"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
            {/* Recent cars */}
            <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Recently Added Cars</h2>
                <Link
                  href="/admin/cars"
                  className="text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  View all
                </Link>
              </div>

              {stats.recentCars.length === 0 ? (
                <EmptyState
                  icon={CarFront}
                  title="No cars yet"
                  description="Add your first vehicle to get started."
                  action={
                    <Link href="/admin/cars/new" className="btn btn-primary btn-sm">
                      <Plus size={16} aria-hidden="true" />
                      Add Car
                    </Link>
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Car</th>
                        <th>Price</th>
                        <th>Visibility</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.recentCars.map((car) => (
                        <tr key={car.id}>
                          <td>
                            <Link
                              href={`/admin/cars/${car.id}`}
                              className="font-semibold hover:text-emerald-700"
                            >
                              {car.title}
                            </Link>
                            <p className="text-xs text-base-content/50">
                              {car.brand} · {car.year}
                            </p>
                          </td>
                          <td className="whitespace-nowrap">
                            {formatPrice(car.price)}
                          </td>
                          <td>
                            <span
                              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                                car.isPublished
                                  ? 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300'
                                  : 'bg-base-200 text-base-content/70'
                              }`}
                            >
                              {car.isPublished ? 'Published' : 'Hidden'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Recent inquiries */}
            <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-bold">Recent Enquiries</h2>
                <Link
                  href="/admin/inquiries"
                  className="text-sm font-semibold text-emerald-700 transition-colors duration-200 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  View all
                </Link>
              </div>

              {stats.recentInquiries.length === 0 ? (
                <EmptyState
                  icon={Mail}
                  title="No enquiries yet"
                  description="Customer messages will appear here."
                />
              ) : (
                <ul className="divide-y divide-base-200">
                  {stats.recentInquiries.map((inquiry) => (
                    <li key={inquiry.id} className="py-3">
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="flex items-start justify-between gap-3"
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold">
                            {inquiry.name}
                          </p>
                          <p className="truncate text-xs text-base-content/55">
                            {inquiry.email}
                          </p>
                          <p className="mt-1 line-clamp-1 text-sm text-base-content/70">
                            {inquiry.message}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-col items-end gap-2">
                          {statusBadge(inquiry.status)}
                          <span className="text-xs text-base-content/45">
                            {formatDate(inquiry.createdAt)}
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}
