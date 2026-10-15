'use client'

import { useMemo, useState } from 'react'
import {
  ArrowDownUp,
  CarFront,
  Search,
  SlidersHorizontal,
  X,
} from 'lucide-react'
import CarCard from '../cars/CarCard'
import type { CarCardData } from '../../lib/types'

type CarsProps = {
  cars: CarCardData[]
  categories: string[]
}

export default function Cars({ cars, categories }: CarsProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Cars')
  const [maxPrice, setMaxPrice] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const categoryOptions = useMemo(
    () => ['All Cars', ...categories],
    [categories],
  )

  const filteredCars = useMemo(() => {
    const query = search.trim().toLowerCase()

    const result = cars.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(query) ||
        car.category.toLowerCase().includes(query) ||
        String(car.year).includes(query)

      const matchesCategory =
        category === 'All Cars' || car.category === category

      const matchesPrice = maxPrice === 'all' || car.price <= Number(maxPrice)

      return matchesSearch && matchesCategory && matchesPrice
    })

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.year - a.year)
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => a.year - b.year)
    } else {
      result.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
      )
    }

    return result
  }, [cars, search, category, maxPrice, sortBy])

  const clearFilters = () => {
    setSearch('')
    setCategory('All Cars')
    setMaxPrice('all')
    setSortBy('featured')
  }

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Page Hero */}
      <section className="relative overflow-hidden bg-base-200 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="pointer-events-none absolute -top-24 -right-20 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-base-content/10 bg-base-100 px-4 py-2 text-sm font-semibold">
              <CarFront size={18} className="text-primary" />
              BB Car House
            </div>

            <h1 className="text-4xl leading-tight font-black tracking-tight sm:text-5xl lg:text-6xl">
              Find the Car That
              <span className="block text-primary">Moves You Forward.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-base-content/70 sm:text-lg">
              Explore our car collection, compare prices and specifications,
              and find a vehicle that fits your needs.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full bg-base-100 px-4 py-2 font-medium">
                {cars.length} Listed Cars
              </span>
              <span className="rounded-full bg-base-100 px-4 py-2 font-medium">
                Multiple Categories
              </span>
              <span className="rounded-full bg-base-100 px-4 py-2 font-medium">
                Easy Enquiries
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Car Collection */}
      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-bold tracking-[0.18em] text-primary uppercase">
                Browse Inventory
              </p>
              <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                Explore Our Cars
              </h2>
              <p className="mt-3 text-base-content/65">
                Find your next drive from our collection.
              </p>
            </div>

            <p className="text-sm font-medium text-base-content/65">
              Showing {filteredCars.length} of {cars.length} cars
            </p>
          </div>

          {/* Search and Mobile Filter */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <label className="input input-bordered flex h-12 w-full items-center gap-3 rounded-xl bg-base-100 sm:flex-1">
              <Search size={19} className="shrink-0 text-base-content/50" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by car name, year or category..."
                className="grow"
                aria-label="Search cars"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="btn btn-ghost btn-xs btn-square"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <button
              type="button"
              className="btn btn-outline h-12 rounded-xl sm:hidden"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
            >
              <SlidersHorizontal size={18} />
              {filtersOpen ? 'Hide Filters' : 'Filters'}
            </button>

            <label className="select select-bordered h-12 w-full rounded-xl bg-base-100 sm:w-60">
              <span className="sr-only">Sort cars</span>
              <ArrowDownUp size={17} className="text-base-content/60" />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort cars"
              >
                <option value="featured">Featured first</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="newest">Year: Newest First</option>
                <option value="oldest">Year: Oldest First</option>
              </select>
            </label>
          </div>

          {/* Filters */}
          <div
            className={`mb-8 rounded-2xl border border-base-300 bg-base-200/40 p-4 sm:p-5 ${
              filtersOpen ? 'block' : 'hidden sm:block'
            }`}
          >
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="mb-3 text-sm font-bold">Car Category</p>
                <div className="flex flex-wrap gap-2">
                  {categoryOptions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setCategory(item)}
                      className={`btn btn-sm rounded-full ${
                        category === item
                          ? 'btn-primary'
                          : 'btn-ghost border border-base-300'
                      }`}
                      aria-pressed={category === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="w-full lg:max-w-xs">
                <label
                  htmlFor="max-price"
                  className="mb-3 block text-sm font-bold"
                >
                  Maximum Price
                </label>
                <select
                  id="max-price"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className="select select-bordered w-full rounded-xl bg-base-100"
                >
                  <option value="all">Any Price</option>
                  <option value="3000000">Up to ৳ 30 Lakh</option>
                  <option value="4000000">Up to ৳ 40 Lakh</option>
                  <option value="5000000">Up to ৳ 50 Lakh</option>
                  <option value="6000000">Up to ৳ 60 Lakh</option>
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="btn btn-ghost rounded-xl"
              >
                <X size={17} />
                Clear Filters
              </button>
            </div>
          </div>

          {/* Results */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-base-300 bg-base-200/30 px-5 py-16 text-center">
              <Search
                size={42}
                className="mx-auto mb-4 text-base-content/40"
              />
              <h3 className="text-xl font-bold">
                {cars.length === 0 ? 'No Cars Available Yet' : 'No Cars Found'}
              </h3>
              <p className="mt-2 text-base-content/65">
                {cars.length === 0
                  ? 'Our inventory is being updated. Please check back soon.'
                  : 'Try changing your search or filters to see more cars.'}
              </p>
              {cars.length > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="btn btn-primary mt-5 rounded-xl"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

          {/* Disclaimer */}
          <p className="mt-8 text-sm leading-6 text-base-content/55">
            Note: Vehicle information and prices are provided by BB Car House
            and may change. Confirm actual availability, mileage, condition,
            registration and price before making a purchase.
          </p>
        </div>
      </section>
    </div>
  )
}
