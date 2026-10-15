import type { DealerInfo } from './types'

/**
 * Server-only dealer contact configuration.
 *
 * The repository ships without any verified business information (the Contact
 * page and Footer previously rendered placeholders such as "Add your showroom
 * phone number"), so every value is read from the environment and is optional.
 * When a value is missing the matching public link is omitted rather than
 * filled with an invented phone number, email address or map location.
 *
 * This module reads `process.env`, so it must never be imported from a Client
 * Component. Read it in a Server Component and pass the result down as props —
 * the values are public, but keeping the read server-side keeps a single source
 * of truth and avoids exposing the rest of the server environment.
 */

function readEnv(value: string | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/** Resolves the dealer's public contact details, omitting anything unset. */
export function getDealerInfo(): DealerInfo {
  const phone = readEnv(process.env.DEALER_PHONE)

  return {
    phone,
    // Falls back to the phone number when a dedicated WhatsApp number is unset.
    whatsapp: readEnv(process.env.DEALER_WHATSAPP) ?? phone,
    email: readEnv(process.env.DEALER_EMAIL),
    address: readEnv(process.env.DEALER_ADDRESS),
    mapUrl: readEnv(process.env.DEALER_MAP_URL),
  }
}

/** Canonical public origin used to build absolute links to car pages. */
export function getSiteUrl(): string {
  return readEnv(process.env.SITE_URL) ?? 'http://localhost:3000'
}

/** Absolute canonical URL for a car detail page, e.g. `.../cars/toyota-axio`. */
export function buildCarUrl(slug: string): string {
  return new URL(`/cars/${encodeURIComponent(slug)}`, getSiteUrl()).toString()
}
