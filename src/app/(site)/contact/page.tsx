import type { Metadata } from 'next'
import Contact from '@/components/pages/Contact'
import { fetchCarBySlug } from '@/lib/api'
import { buildCarUrl, getDealerInfo } from '@/lib/dealer'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Call, WhatsApp, email or message BB Car House about any vehicle in our collection.',
}

/**
 * Loads the optional `?car=<slug>` context for the contact form.
 *
 * The slug is validated against the database (unpublished/deleted/invalid ids
 * resolve to `null`), so car details are never trusted from the URL itself.
 */
export default async function Page(props: PageProps<'/contact'>) {
  const searchParams = await props.searchParams
  const rawCar = searchParams?.car
  const slug = Array.isArray(rawCar) ? rawCar[0] : rawCar
  const car = slug ? await fetchCarBySlug(slug) : null

  return (
    <Contact
      dealer={getDealerInfo()}
      car={car}
      carUrl={car ? buildCarUrl(car.slug) : null}
    />
  )
}
