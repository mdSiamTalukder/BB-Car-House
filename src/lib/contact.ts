import { formatPrice } from './format'
import type { CarEnquiryContext } from './types'

/**
 * Pure helpers for building contact links and prefilled messages.
 *
 * These have no environment or server-only imports, so they are safe to use
 * from both Server and Client Components.
 */

/**
 * Normalises a configured number into the digits-only form `wa.me` expects.
 *
 * A local Bangladeshi number such as `01712-345678` becomes `8801712345678`;
 * a number that already carries its country code is passed through unchanged.
 */
export function toWhatsAppNumber(value: string): string {
  const digits = value.replace(/\D/g, '')

  if (digits.startsWith('0')) {
    return `880${digits.replace(/^0+/, '')}`
  }

  return digits
}

/** `tel:` target that keeps an optional leading `+` and strips formatting. */
export function toTelHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, '')}`
}

/** Opens a WhatsApp conversation, optionally with a prefilled message. */
export function buildWhatsAppHref(number: string, message?: string): string {
  const base = `https://wa.me/${toWhatsAppNumber(number)}`

  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

/** Opens the visitor's mail client, optionally with a prefilled subject. */
export function buildMailtoHref(email: string, subject?: string): string {
  return subject
    ? `mailto:${email}?subject=${encodeURIComponent(subject)}`
    : `mailto:${email}`
}

/**
 * Prefilled WhatsApp/enquiry message identifying a specific car using only its
 * real database values plus its canonical URL.
 */
export function buildCarEnquiryMessage(
  car: CarEnquiryContext,
  carUrl: string,
): string {
  return [
    `Hello BB Car House, I am interested in ${car.title} (${car.brand} ${car.model}, ${car.year}) priced at ${formatPrice(car.price)}.`,
    'Please share more details and let me know how I can arrange a viewing or test drive.',
    '',
    `Car link: ${carUrl}`,
  ].join('\n')
}

/**
 * Extracts the most useful message from an API error envelope.
 *
 * The backend returns `{ message, errors }` where `errors` is a field → message
 * map (Zod output). Surfacing a field error gives clearer feedback than the
 * generic "Request validation failed." message.
 */
export function extractApiError(payload: unknown, fallback: string): string {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const body = payload as { message?: unknown; errors?: unknown }

  if (body.errors && typeof body.errors === 'object') {
    for (const value of Object.values(body.errors as Record<string, unknown>)) {
      if (Array.isArray(value)) {
        const first = value.find(
          (entry): entry is string => typeof entry === 'string' && entry.trim() !== '',
        )
        if (first) return first
      } else if (typeof value === 'string' && value.trim() !== '') {
        return value
      }
    }
  }

  if (typeof body.message === 'string' && body.message.trim() !== '') {
    return body.message
  }

  return fallback
}
