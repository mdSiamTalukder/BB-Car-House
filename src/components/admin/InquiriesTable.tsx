'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Eye, Mail, MessageSquare, Search } from 'lucide-react'
import { adminFetch } from '../../lib/adminClient'
import type { InquiryDto } from '../../lib/types'
import { formatDate, INQUIRY_STATUS_LABELS } from '../../lib/format'
import {
  AdminPageHeader,
  EmptyState,
  ErrorState,
  Skeleton,
} from './ui'

function statusBadge(status: string) {
  const styles: Record<string, string> = {
    NEW: 'bg-sky-500/15 text-sky-700 dark:text-sky-300',
    CONTACTED: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    CLOSED: 'bg-emerald-600/15 text-emerald-700 dark:text-emerald-300',
  }

  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${
        styles[status] ?? 'bg-base-200'
      }`}
    >
      {INQUIRY_STATUS_LABELS[status] ?? status}
    </span>
  )
}

export default function InquiriesTable() {
  const [inquiries, setInquiries] = useState<InquiryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      const response = await adminFetch<{ inquiries: InquiryDto[] }>(
        'inquiries?pageSize=50&sort=newest',
      )
      if (!active) return

      if (!response.ok || !response.data) {
        setError(response.message || 'Unable to load enquiries.')
        setInquiries([])
      } else {
        setInquiries(response.data.inquiries)
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

    return inquiries.filter((inquiry) => {
      const matchesSearch =
        !query ||
        inquiry.name.toLowerCase().includes(query) ||
        inquiry.email.toLowerCase().includes(query) ||
        inquiry.message.toLowerCase().includes(query)

      const matchesStatus =
        statusFilter === 'all' || inquiry.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [inquiries, search, statusFilter])

  return (
    <div>
      <AdminPageHeader
        title="Enquiries"
        description="Messages submitted through the public contact and car enquiry forms."
      />

      <div className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <label className="input input-bordered flex items-center gap-2 bg-base-100 sm:col-span-2">
          <Search size={18} className="opacity-60" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, email or message..."
            className="grow bg-transparent outline-none"
            aria-label="Search enquiries"
          />
        </label>

        <select
          className="select select-bordered bg-base-100"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {error && (
        <div className="mb-5">
          <ErrorState message={error} onRetry={reload} />
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-16" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          title={
            inquiries.length === 0 ? 'No enquiries yet' : 'No matching enquiries'
          }
          description={
            inquiries.length === 0
              ? 'Messages from the website will appear here.'
              : 'Try changing your search or filters.'
          }
        />
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-base-300 bg-base-100 shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Message</th>
                <th>Car</th>
                <th>Status</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((inquiry) => (
                <tr key={inquiry.id}>
                  <td>
                    <Link
                      href={`/admin/inquiries/${inquiry.id}`}
                      className="font-semibold hover:text-emerald-700"
                    >
                      {inquiry.name}
                    </Link>
                    <p className="text-xs text-base-content/50">
                      {inquiry.email}
                    </p>
                    {inquiry.phone && (
                      <p className="text-xs text-base-content/50">
                        {inquiry.phone}
                      </p>
                    )}
                  </td>
                  <td className="max-w-xs">
                    <p className="line-clamp-2 text-sm text-base-content/70">
                      {inquiry.message}
                    </p>
                  </td>
                  <td className="whitespace-nowrap text-sm">
                    {inquiry.car ? (
                      <span className="text-base-content/70">
                        {inquiry.car.title}
                      </span>
                    ) : (
                      <span className="text-base-content/40">General</span>
                    )}
                  </td>
                  <td>{statusBadge(inquiry.status)}</td>
                  <td className="whitespace-nowrap text-sm text-base-content/60">
                    {formatDate(inquiry.createdAt)}
                  </td>
                  <td>
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={`mailto:${inquiry.email}`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label={`Email ${inquiry.name}`}
                      >
                        <Mail size={16} />
                      </a>
                      <Link
                        href={`/admin/inquiries/${inquiry.id}`}
                        className="btn btn-ghost btn-square btn-sm"
                        aria-label={`View enquiry from ${inquiry.name}`}
                      >
                        <Eye size={16} />
                      </Link>
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
