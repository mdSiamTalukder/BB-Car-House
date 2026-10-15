import Cars from '@/components/pages/Cars'
import {
  fetchCarFacets,
  fetchPublishedCars,
  sortFeaturedFirst,
  toCardData,
} from '@/lib/api'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const [{ cars }, facets] = await Promise.all([
    fetchPublishedCars({ pageSize: 100, sort: 'newest' }),
    fetchCarFacets(),
  ])

  const orderedCars = sortFeaturedFirst(cars).map(toCardData)

  // Fall back to the categories present in the returned cars if the facets
  // endpoint is unavailable.
  const categories =
    facets.categories.length > 0
      ? facets.categories
      : [...new Set(orderedCars.map((car) => car.category))]

  return <Cars cars={orderedCars} categories={categories} />
}
