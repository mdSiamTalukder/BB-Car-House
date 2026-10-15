'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  Fuel,
  Gauge,
  Mail,
  MessageCircle,
  Phone,
  Settings2,
  Tag,
} from 'lucide-react'
import type { CarDto, DealerInfo } from '../../lib/types'
import { FALLBACK_CAR_IMAGE } from '../../lib/constants'
import { buildCarEnquiryMessage, buildWhatsAppHref, toTelHref } from '../../lib/contact'

const statusLabels: Record<string, string> = {
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  SOLD: 'Sold',
}

const inputClass =
  'input input-bordered w-full bg-base-200/20 outline-none transition-colors focus:border-emerald-600 focus:outline-none'

function formatPrice(price: number) {
  return `৳ ${price.toLocaleString('en-BD')}`
}

export default function CarDetail({
  car,
  dealer,
  carUrl,
}: {
  car: CarDto
  dealer: DealerInfo
  carUrl: string
}) {
  const images = car.images.length > 0 ? car.images : []
  const [activeImage, setActiveImage] = useState(0)
  const whatsappMessage = buildCarEnquiryMessage(car, carUrl)

  const specs = [
    { icon: Calendar, label: 'Year', value: String(car.year) },
    { icon: Gauge, label: 'Mileage', value: `${car.mileage.toLocaleString('en-BD')} km` },
    { icon: Fuel, label: 'Fuel Type', value: car.fuelType ?? 'N/A' },
    { icon: Settings2, label: 'Transmission', value: car.transmission ?? 'N/A' },
    { icon: Tag, label: 'Category', value: car.category ?? 'Other' },
    { icon: BadgeCheck, label: 'Condition', value: car.condition ?? 'N/A' },
  ]

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <Link
          href="/cars"
          className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-colors hover:text-emerald-800 dark:text-emerald-400"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to all cars
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          {/* Gallery */}
          <div>
            <div className="overflow-hidden rounded-2xl border border-base-300 bg-base-200">
              <img
                src={
                  images.length > 0
                    ? (images[activeImage]?.url ?? FALLBACK_CAR_IMAGE)
                    : FALLBACK_CAR_IMAGE
                }
                alt={`${car.year} ${car.title}`}
                className="aspect-[16/11] w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src = FALLBACK_CAR_IMAGE
                }}
              />
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5">
                {images.map((image, index) => (
                  <button
                    key={image.id}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-pressed={activeImage === index}
                    className={`overflow-hidden rounded-xl border-2 transition-colors ${
                      activeImage === index
                        ? 'border-emerald-600'
                        : 'border-transparent hover:border-emerald-600/40'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.alt ?? `${car.title} image ${index + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {car.description && (
              <div className="mt-8">
                <h2 className="text-xl font-bold">Description</h2>
                <p className="mt-3 leading-8 whitespace-pre-line text-base-content/75">
                  {car.description}
                </p>
              </div>
            )}
          </div>

          {/* Summary + specs */}
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-semibold">
                {car.brand}
              </span>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${
                  car.status === 'AVAILABLE'
                    ? 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-500/15 text-amber-700 dark:text-amber-300'
                }`}
              >
                {statusLabels[car.status] ?? car.status}
              </span>
            </div>

            <h1 className="mt-4 text-3xl leading-tight font-black tracking-tight sm:text-4xl">
              {car.title}
            </h1>

            <p className="mt-3 text-base text-base-content/65">
              {car.brand} {car.model} · {car.year}
            </p>

            <p className="mt-5 text-3xl font-black tracking-tight text-[#047857] dark:text-[#93C5FD] sm:text-4xl">
              {formatPrice(car.price)}
            </p>

            {/* Direct dealer contact actions */}
            <div className="mt-6 flex flex-wrap gap-3">
              {dealer.phone && (
                <a
                  href={toTelHref(dealer.phone)}
                  className="btn flex-1 basis-40 border-emerald-700 bg-emerald-700 text-white whitespace-nowrap transition-colors hover:border-emerald-800 hover:bg-emerald-800"
                >
                  <Phone size={18} aria-hidden="true" />
                  Call Dealer
                </a>
              )}

              {dealer.whatsapp && (
                <a
                  href={buildWhatsAppHref(dealer.whatsapp, whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn flex-1 basis-40 border-emerald-700 bg-emerald-700 text-white whitespace-nowrap transition-colors hover:border-emerald-800 hover:bg-emerald-800"
                >
                  <MessageCircle size={18} aria-hidden="true" />
                  WhatsApp Dealer
                </a>
              )}

              <Link
                href={`/contact?car=${encodeURIComponent(car.slug)}`}
                className="btn btn-outline flex-1 basis-40 border-emerald-700 whitespace-nowrap text-emerald-700 transition-colors hover:border-emerald-800 hover:bg-emerald-700 hover:text-white dark:text-emerald-300"
              >
                <Mail size={18} aria-hidden="true" />
                Contact Dealer
              </Link>
            </div>

            <div className="mt-7 grid grid-cols-2 gap-3">
              {specs.map(({ icon: Icon, label, value }) => (
                <div
                  key={label}
                  className="flex items-center gap-3 rounded-xl border border-base-300 bg-base-200/30 px-4 py-3"
                >
                  <Icon
                    size={20}
                    className="shrink-0 text-emerald-700 dark:text-emerald-300"
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="text-xs text-base-content/55">{label}</p>
                    <p className="truncate text-sm font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Inquiry form */}
            <CarInquiryForm carId={car.id} carTitle={car.title} />
          </div>
        </div>
      </section>
    </div>
  )
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

function CarInquiryForm({
  carId,
  carTitle,
}: {
  carId: string
  carTitle: string
}) {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)

    setState('submitting')
    setError('')

    try {
      const response = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          phone: formData.get('phone') || undefined,
          message: formData.get('message'),
          carId,
        }),
      })

      const body = await response.json().catch(() => null)

      if (!response.ok) {
        setError(
          body?.message ??
            'We could not send your enquiry. Please try again.',
        )
        setState('error')
        return
      }

      form.reset()
      setState('success')
    } catch {
      setError('Network error. Please check your connection and try again.')
      setState('error')
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
      <h2 className="text-lg font-bold">Enquire About This Car</h2>
      <p className="mt-1 text-sm text-base-content/60">
        Send us your details and we will get back to you about the {carTitle}.
      </p>

      {state === 'success' && (
        <div
          role="status"
          className="mt-4 flex items-start gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 p-4 text-sm text-base-content"
        >
          <CheckCircle2
            size={18}
            className="mt-0.5 shrink-0 text-emerald-600"
            aria-hidden="true"
          />
          <p>
            Thank you. Your enquiry has been received and our team will contact
            you soon.
          </p>
        </div>
      )}

      {state === 'error' && error && (
        <div
          role="alert"
          className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-base-content"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 grid gap-4">
        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">
            Your Name <span className="text-emerald-600">*</span>
          </span>
          <input
            name="name"
            type="text"
            required
            minLength={2}
            autoComplete="name"
            placeholder="Enter your name"
            className={inputClass}
          />
        </label>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="form-control w-full">
            <span className="label-text mb-2 font-semibold">
              Email <span className="text-emerald-600">*</span>
            </span>
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className={inputClass}
            />
          </label>

          <label className="form-control w-full">
            <span className="label-text mb-2 font-semibold">Phone</span>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              placeholder="01XXXXXXXXX"
              className={inputClass}
            />
          </label>
        </div>

        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">
            Message <span className="text-emerald-600">*</span>
          </span>
          <textarea
            name="message"
            required
            minLength={10}
            placeholder={`I'm interested in the ${carTitle}. Please share more details.`}
            defaultValue={`I'm interested in the ${carTitle}. Please share more details.`}
            className="textarea textarea-bordered min-h-28 w-full resize-y bg-base-200/20 leading-7 outline-none transition-colors focus:border-emerald-600 focus:outline-none"
          />
        </label>

        <button
          type="submit"
          disabled={state === 'submitting'}
          className="btn border-emerald-700 bg-emerald-700 text-white transition-colors hover:border-emerald-800 hover:bg-emerald-800 disabled:opacity-60"
        >
          {state === 'submitting' ? 'Sending...' : 'Send Enquiry'}
        </button>
      </form>
    </div>
  )
}
