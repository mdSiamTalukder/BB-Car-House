import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CarDetail from '@/components/cars/CarDetail'
import { fetchCarBySlug } from '@/lib/api'
import { buildCarUrl, getDealerInfo } from '@/lib/dealer'

export const dynamic = 'force-dynamic'

export async function generateMetadata(
  props: PageProps<'/cars/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params
  const car = await fetchCarBySlug(slug)

  if (!car) {
    return { title: 'Car not found' }
  }

  return {
    title: `${car.title} (${car.year})`,
    description:
      car.description ??
      `${car.brand} ${car.model}, ${car.year} — available at BB Car House.`,
  }
}

export default async function Page(props: PageProps<'/cars/[slug]'>) {
  const { slug } = await props.params
  const car = await fetchCarBySlug(slug)

  if (!car) {
    notFound()
  }

  return (
    <CarDetail
      car={car}
      dealer={getDealerInfo()}
      carUrl={buildCarUrl(car.slug)}
    />
  )
}
