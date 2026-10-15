import Home from '@/components/pages/Home'
import { fetchPublishedCars, sortFeaturedFirst, toCardData } from '@/lib/api'

// Inventory changes at runtime, so always render from fresh API data.
export const dynamic = 'force-dynamic'

export default async function Page() {
  const { cars } = await fetchPublishedCars({ pageSize: 12, sort: 'newest' })

  return <Home cars={sortFeaturedFirst(cars).map(toCardData)} />
}
