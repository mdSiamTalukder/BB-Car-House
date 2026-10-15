'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CarFront,
  CheckCircle2,
  Mail,
  Phone,
  Trash2,
} from 'lucide-react'
import { adminFetch } from '../../lib/adminClient'
import type { InquiryDto } from '../../lib/types'
import {
  formatDateTime,
  INQUIRY_STATUS_LABELS,
} from '../../lib/format'
import { ErrorState, Skeleton } from './ui'

const STATUSES = ['NEW', 'CONTACTED', 'CLOSED'] as const

export default function InquiryDetail({ inquiryId }: { inquiryId: string }) {
  const router = useRouter()
  const [inquiry, setInquiry] = useState<InquiryDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [success, setSuccess] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    async function load() {
      const response = await adminFetch<{ inquiry: InquiryDto }>(
        `inquiries/${inquiryId}`,
      )
      if (!active) return

      if (!response.ok || !response.data) {
        setError(response.message || 'Unable to load this enquiry.')
        setInquiry(null)
      } else {
        setInquiry(response.data.inquiry)
        setError('')
      }

      setLoading(false)
    }

    void load()

    return () => {
      active = false
    }
  }, [inquiryId, reloadKey])

  function reload() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  async function setStatus(status: string) {
    setBusy(true)
    setError('')
    setSuccess('')

    const response = await adminFetch<{ inquiry: InquiryDto }>(
      `inquiries/${inquiryId}`,
      { method: 'PATCH', body: JSON.stringify({ status }) },
    )

    if (response.ok && response.data) {
      setInquiry(response.data.inquiry)
      setSuccess(`Marked as ${INQUIRY_STATUS_LABELS[status] ?? status}.`)
    } else {
      setError(response.message || 'Could not update the status.')
    }

    setBusy(false)
  }

  async function remove() {
    const confirmed = window.confirm(
      'Delete this enquiry? This cannot be undone.',
    )

    if (!confirmed) return

    setBusy(true)
    const response = await adminFetch<null>(`inquiries/${inquiryId}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      router.push('/admin/inquiries')
      router.refresh()
    } else {
      setError(response.message || 'Could not delete the enquiry.')
      setBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72" />
      </div>
    )
  }

  if (error && !inquiry) {
    return <ErrorState message={error} onRetry={reload} />
  }

  if (!inquiry) return null

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/inquiries"
        className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to enquiries
      </Link>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
            {inquiry.name}
          </h1>
          <p className="mt-1 text-sm text-base-content/60">
            {formatDateTime(inquiry.createdAt)}
          </p>
        </div>

        <button
          type="button"
          onClick={remove}
          disabled={busy}
          className="btn btn-outline btn-sm text-red-600 hover:bg-red-500/10 dark:text-red-400"
        >
          <Trash2 size={15} aria-hidden="true" />
          Delete
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 p-4 text-sm">
          <CheckCircle2 size={17} className="text-emerald-600" aria-hidden="true" />
          {success}
        </div>
      )}

      <div className="space-y-5">
        {/* Status control */}
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold">Status</h2>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatus(status)}
                disabled={busy || inquiry.status === status}
                className={`btn btn-sm ${
                  inquiry.status === status
                    ? 'btn-primary'
                    : 'btn-outline'
                }`}
                aria-pressed={inquiry.status === status}
              >
                {INQUIRY_STATUS_LABELS[status]}
              </button>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold">Contact Details</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <a
              href={`mailto:${inquiry.email}`}
              className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-200/30 px-4 py-3 transition-colors hover:border-emerald-600/50"
            >
              <Mail size={18} className="text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              <span className="min-w-0 truncate text-sm">{inquiry.email}</span>
            </a>

            <div className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-200/30 px-4 py-3">
              <Phone size={18} className="text-emerald-700 dark:text-emerald-300" aria-hidden="true" />
              <span className="min-w-0 truncate text-sm">
                {inquiry.phone ?? 'Not provided'}
              </span>
            </div>
          </div>
        </section>

        {/* Related car */}
        {inquiry.car && (
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="mb-3 text-sm font-bold">Related Car</h2>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-base-200">
                <CarFront size={20} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <Link
                  href={`/admin/cars/${inquiry.car.id}`}
                  className="block truncate font-semibold hover:text-emerald-700"
                >
                  {inquiry.car.title}
                </Link>
                <p className="text-xs text-base-content/50">
                  {inquiry.car.brand} {inquiry.car.model} · {inquiry.car.year}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Message */}
        <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold">Message</h2>
          <p className="leading-7 whitespace-pre-line text-base-content/80">
            {inquiry.message}
          </p>
        </section>
      </div>
    </div>
  )
}
