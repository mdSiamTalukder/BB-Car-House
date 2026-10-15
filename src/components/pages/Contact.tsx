'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  X,
} from 'lucide-react'
import type { CarDto, DealerInfo } from '../../lib/types'
import {
  buildCarEnquiryMessage,
  buildMailtoHref,
  buildWhatsAppHref,
  extractApiError,
  toTelHref,
} from '../../lib/contact'
import { formatPrice } from '../../lib/format'

type FormState = 'idle' | 'submitting' | 'success' | 'error'

type ContactProps = {
  /** Dealer contact details; unset values fall back to a neutral placeholder. */
  dealer: DealerInfo
  /** Car being enquired about, resolved server-side from `?car=<slug>`. */
  car: CarDto | null
  /** Absolute canonical URL of `car`, used in the prefilled message. */
  carUrl: string | null
}

type ContactDetail = {
  icon: typeof Phone
  title: string
  detail: string
  href?: string
  external?: boolean
}

const cardClass =
  'group flex items-start gap-4 rounded-xl border border-base-300 bg-base-200/20 p-4 transition-colors duration-200 hover:border-emerald-600/50 hover:bg-base-200/50 sm:p-5'

const inputClass =
  'input input-bordered w-full bg-base-200/20 outline-none transition-colors focus:border-emerald-600 focus:outline-none'

function ContactCard({ icon: Icon, title, detail, href, external }: ContactDetail) {
  const inner = (
    <>
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-600/10 text-emerald-600 transition-colors duration-200 group-hover:bg-emerald-600 group-hover:text-white">
        <Icon size={20} aria-hidden="true" />
      </div>

      <div className="min-w-0 pt-0.5">
        <h3 className="text-sm font-bold">{title}</h3>
        <p className="mt-1 text-sm leading-6 break-words text-base-content/65">
          {detail}
        </p>
      </div>
    </>
  )

  if (href) {
    return (
      <a
        href={href}
        className={cardClass}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    )
  }

  return <div className={cardClass}>{inner}</div>
}

export default function Contact({ dealer, car, carUrl }: ContactProps) {
  const [state, setState] = useState<FormState>('idle')
  const [error, setError] = useState('')

  const hasCarContact = Boolean(dealer.phone || dealer.whatsapp || dealer.email)
  const defaultMessage = car
    ? buildCarEnquiryMessage(car, carUrl ?? `/cars/${car.slug}`)
    : ''

  const contactDetails: ContactDetail[] = [
    dealer.phone
      ? { icon: Phone, title: 'Phone', detail: dealer.phone, href: toTelHref(dealer.phone) }
      : { icon: Phone, title: 'Phone', detail: 'Add your showroom phone number' },
    dealer.email
      ? {
          icon: Mail,
          title: 'Email',
          detail: dealer.email,
          href: buildMailtoHref(dealer.email),
        }
      : { icon: Mail, title: 'Email', detail: 'Add your showroom email address' },
    dealer.address
      ? {
          icon: MapPin,
          title: 'Showroom',
          detail: dealer.address,
          href: dealer.mapUrl ?? undefined,
          external: Boolean(dealer.mapUrl),
        }
      : { icon: MapPin, title: 'Showroom', detail: 'Add your showroom address' },
  ]

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Guard against duplicate submissions while a request is in flight.
    if (state === 'submitting') return

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
          // Empty strings are accepted by the API and stored as "not provided".
          phone: formData.get('phone'),
          message: formData.get('message'),
          ...(car ? { carId: car.id } : {}),
        }),
      })

      const body = await response.json().catch(() => null)

      if (!response.ok) {
        setError(
          extractApiError(
            body,
            'We could not send your message. Please try again.',
          ),
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
    <main className="min-h-screen bg-base-100 text-base-content">
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-20">
        {/* Page Heading */}
        <div className="mb-10 border-b border-base-300 pb-7 sm:mb-12 sm:pb-9">
          <p className="mb-3 text-xs font-bold tracking-[0.2em] text-emerald-600 uppercase">
            CONTACT BB CAR HOUSE
          </p>

          <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
            Let’s Talk About Your{' '}
            <span className="text-emerald-600">Next Car.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-base-content/65 sm:text-base">
            Have a question about a vehicle? We’re here to help you find the
            right car for your needs.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {/* Contact Information */}
          <aside className="space-y-7">
            <div>
              <h2 className="text-xl font-bold sm:text-2xl">
                Contact Information
              </h2>

              <p className="mt-3 max-w-md text-sm leading-7 text-base-content/65">
                Get in touch with us for vehicle details, pricing, or help
                choosing your next car.
              </p>
            </div>

            <div className="space-y-3">
              {contactDetails.map((detail) => (
                <ContactCard key={detail.title} {...detail} />
              ))}
            </div>

            {dealer.whatsapp && (
              <a
                href={buildWhatsAppHref(
                  dealer.whatsapp,
                  'Hello BB Car House, I would like to know more about your cars.',
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="btn w-full border-emerald-700 bg-emerald-700 text-white transition-colors duration-200 hover:border-emerald-800 hover:bg-emerald-800"
              >
                <MessageCircle size={18} aria-hidden="true" />
                Chat on WhatsApp
              </a>
            )}

            <div className="rounded-xl border-l-4 border-emerald-600 bg-base-200/40 px-5 py-4">
              <div className="flex items-center gap-2 font-semibold">
                <MessageCircle
                  size={18}
                  className="text-emerald-600"
                  aria-hidden="true"
                />
                Need help choosing?
              </div>

              <p className="mt-2 text-sm leading-6 text-base-content/65">
                Send us your questions and let us know what kind of car
                you’re looking for.
              </p>

              {!hasCarContact && (
                <p className="mt-2 text-xs leading-5 text-base-content/50">
                  Direct calling and WhatsApp are not configured yet — use the
                  form and we will follow up by email.
                </p>
              )}
            </div>
          </aside>

          {/* Contact Form */}
          <section className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8 lg:p-9">
            <div className="mb-7">
              <h2 className="text-xl font-bold sm:text-2xl">
                Send Us a Message
              </h2>

              <p className="mt-2 text-sm leading-6 text-base-content/65">
                Fill in the details below and tell us how we can help.
              </p>
            </div>

            {car && (
              <div className="mb-6 flex items-start justify-between gap-3 rounded-xl border border-emerald-600/30 bg-emerald-600/5 p-4">
                <div className="min-w-0">
                  <p className="text-xs font-bold tracking-wide text-emerald-700 uppercase dark:text-emerald-300">
                    Enquiring about
                  </p>
                  <Link
                    href={`/cars/${car.slug}`}
                    className="mt-1 block truncate font-semibold hover:text-emerald-700"
                  >
                    {car.title}
                  </Link>
                  <p className="text-xs text-base-content/60">
                    {car.brand} {car.model} · {car.year} ·{' '}
                    {formatPrice(car.price)}
                  </p>
                </div>

                <Link
                  href="/contact"
                  className="btn btn-ghost btn-xs shrink-0"
                  aria-label="Remove this car from the enquiry"
                >
                  <X size={14} aria-hidden="true" />
                </Link>
              </div>
            )}

            {state === 'success' && (
              <div
                role="status"
                className="mb-6 flex items-start gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 p-4 text-sm leading-6 text-base-content"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <p>
                  Thank you. Your message has been received and our team will
                  get back to you shortly.
                </p>
              </div>
            )}

            {state === 'error' && error && (
              <div
                role="alert"
                className="mb-6 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm leading-6 text-base-content"
              >
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              onChange={() => {
                if (state !== 'idle') setState('idle')
              }}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="form-control w-full">
                  <span className="label-text mb-2 font-semibold">
                    Your Name <span className="text-emerald-600">*</span>
                  </span>

                  <input
                    name="name"
                    type="text"
                    placeholder="Enter your name"
                    autoComplete="name"
                    minLength={2}
                    className={inputClass}
                    required
                  />
                </label>

                <label className="form-control w-full">
                  <span className="label-text mb-2 font-semibold">
                    Email Address <span className="text-emerald-600">*</span>
                  </span>

                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputClass}
                    required
                  />
                </label>

                <label className="form-control w-full sm:col-span-2">
                  <span className="label-text mb-2 font-semibold">
                    Phone Number
                  </span>

                  <input
                    name="phone"
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    className={inputClass}
                  />
                </label>

                <label className="form-control w-full sm:col-span-2">
                  <span className="label-text mb-2 font-semibold">
                    Message <span className="text-emerald-600">*</span>
                  </span>

                  <textarea
                    name="message"
                    placeholder="Tell us how we can help..."
                    defaultValue={defaultMessage}
                    className="textarea textarea-bordered min-h-36 w-full resize-y bg-base-200/20 leading-7 outline-none transition-colors focus:border-emerald-600 focus:outline-none"
                    minLength={10}
                    required
                  />
                </label>
              </div>

              <button
                type="submit"
                disabled={state === 'submitting'}
                className="btn mt-6 w-full border-emerald-700 bg-emerald-700 text-white transition-colors duration-200 hover:border-emerald-800 hover:bg-emerald-800 disabled:opacity-60 sm:w-auto"
              >
                {state === 'submitting' ? 'Sending...' : 'Send Message'}
                <Send size={16} aria-hidden="true" />
              </button>

              <p className="mt-4 text-xs leading-5 text-base-content/50">
                * Required fields
              </p>
            </form>
          </section>
        </div>
      </section>
    </main>
  )
}
