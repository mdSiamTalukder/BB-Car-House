'use client'

import {
  ArrowRight,
  BadgeCheck,
  CarFront,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import CarCard, { type Car } from '../cars/CarCard'

const featuredCars: Car[] = [
  {
    id: 1,
    name: 'Toyota Corolla Axio',
    year: 2022,
    price: 2450000,
    mileage: '25,000 km',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    category: 'Sedan',
    image:
      'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1000&q=80',
    featured: true,
  },
  {
    id: 2,
    name: 'Honda Vezel',
    year: 2021,
    price: 3250000,
    mileage: '32,000 km',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    category: 'SUV',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80',
    featured: true,
  },
  {
    id: 3,
    name: 'Toyota Prius',
    year: 2020,
    price: 2850000,
    mileage: '38,000 km',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    category: 'Hatchback',
    image:
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    featured: true,
  },
  {
    id: 4,
    name: 'Honda Civic',
    year: 2022,
    price: 3100000,
    mileage: '28,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    category: 'Sedan',
    image:
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 5,
    name: 'Toyota RAV4',
    year: 2021,
    price: 4650000,
    mileage: '30,000 km',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    category: 'SUV',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 6,
    name: 'BMW 3 Series',
    year: 2020,
    price: 5500000,
    mileage: '35,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    category: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 7,
    name: 'Nissan X-Trail',
    year: 2021,
    price: 3900000,
    mileage: '33,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    category: 'SUV',
    image:
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 8,
    name: 'Mercedes-Benz C-Class',
    year: 2020,
    price: 6200000,
    mileage: '35,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    category: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 9,
    name: 'Honda Grace',
    year: 2021,
    price: 2350000,
    mileage: '29,000 km',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    category: 'Sedan',
    image:
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 10,
    name: 'Toyota Harrier',
    year: 2022,
    price: 5200000,
    mileage: '22,000 km',
    fuel: 'Hybrid',
    transmission: 'Automatic',
    category: 'SUV',
    image:
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 11,
    name: 'Audi A4',
    year: 2021,
    price: 4900000,
    mileage: '27,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    category: 'Luxury',
    image:
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 12,
    name: 'Toyota Yaris',
    year: 2022,
    price: 2150000,
    mileage: '20,000 km',
    fuel: 'Petrol',
    transmission: 'Automatic',
    category: 'Hatchback',
    image:
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=80',
  },
]

const benefits = [
  {
    icon: BadgeCheck,
    title: 'Quality Vehicles',
    description:
      'Explore carefully selected vehicles with clear details to help you choose confidently.',
  },
  {
    icon: ShieldCheck,
    title: 'Trusted Assistance',
    description:
      'Our team helps you understand vehicle options, pricing, and purchase details.',
  },
  {
    icon: CarFront,
    title: 'Find Your Match',
    description:
      'Compare different body styles and discover a car that suits your needs.',
  },
]

const greenButtonClass =
  'border border-base-300 bg-base-100 shadow-sm transition-colors duration-200 hover:border-base-content/30 hover:bg-base-200'

const heroImages = [
  {
    src: 'https://s1.cdn.autoevolution.com/images/news/gallery/florida-dealer-sells-used-2021-bmw-750i-xdrive-m-sport-in-rare-color-for-65k-under-msrp_22.jpg',
    alt: 'Blue luxury sedan',
    position: 'center',
  },
  {
    src: 'https://d3sm3e0zl6r9d1.cloudfront.net/sothebysmotor/vehicles/C8561F30-45E0-4517-A1CB-97A62D181D60/images/7AE21166-A339-4835-AA05-99B2DE943309.webp',
    alt: 'Blue premium luxury car',
    position: 'center',
  },
  {
    src: 'https://hips.hearstapps.com/mtg-prod/65cd0948212e410008323432/2018-genesis-g80-sport-front-side-view-in-motion.jpg?w=1600',
    alt: 'Light blue luxury sedan',
    position: 'center',
  },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [activeHeroImage, setActiveHeroImage] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveHeroImage((current) => (current + 1) % heroImages.length)
    }, 5000)

    return () => window.clearInterval(interval)
  }, [])

  const categories = useMemo(
    () => ['All', ...new Set(featuredCars.map((car) => car.category))],
    [],
  )

  const filteredCars = useMemo(() => {
    const query = search.trim().toLowerCase()

    return featuredCars.filter((car) => {
      const matchesSearch =
        car.name.toLowerCase().includes(query) ||
        String(car.year).includes(query)

      const matchesCategory =
        category === 'All' || car.category === category

      return matchesSearch && matchesCategory
    })
  }, [search, category])

  return (
    <div>
      {/* Hero Section */}
      <section
        id="home"
        className="relative isolate flex min-h-[600px] items-center overflow-hidden bg-base-100 text-base-content sm:min-h-[660px]"
      >
        {heroImages.map((image, index) => (
          <div
            key={image.src}
            role="img"
            aria-label={image.alt}
            className={`absolute inset-0 -z-20 bg-cover transition-opacity duration-1000 ease-in-out ${
              activeHeroImage === index ? 'opacity-100' : 'opacity-0'
            }`}
            style={{
              backgroundImage: `url('${image.src}')`,
              backgroundPosition: image.position,
            }}
          />
        ))}

        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-white/65 via-white/25 to-transparent dark:from-black/20 dark:via-black/5 dark:to-transparent" />

        <div className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="mb-6 inline-flex rounded-full border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold !text-emerald-800 shadow-sm">
              Welcome to BB Car House
            </span>

            <h1 className="text-4xl leading-tight font-black tracking-tight sm:text-5xl md:text-6xl lg:text-7xl light-mode-hero-text">
              Find the car that
              <span className="block text-emerald-700 dark:text-emerald-300 light-mode-hero-text">
                moves you forward.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-base-content/75 sm:text-lg light-mode-hero-text">
              Discover your next vehicle with confidence. Explore our
              collection and find the right balance of comfort, quality, and
              value.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="#featured"
                className={`btn btn-lg transition-colors duration-300 ${greenButtonClass} hover:!border-green-600 hover:!bg-green-600 hover:!text-white`}
              >
                Explore Our Cars
                <ArrowRight size={19} aria-hidden="true" />
              </a>

              <a
                href="#about"
                className="btn btn-lg border-base-content/20 bg-base-100/80 text-base-content transition-colors duration-300 hover:!border-green-600 hover:!bg-green-600 hover:!text-white"
              >
                Why Choose Us?
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm text-base-content/80">
              <span className="flex items-center gap-2">
                <ShieldCheck
                  size={18}
                  className="text-emerald-700 dark:text-emerald-300"
                  aria-hidden="true"
                />
                Customer-focused service
              </span>

              <span className="flex items-center gap-2">
                <BadgeCheck
                  size={18}
                  className="text-emerald-700 dark:text-emerald-300"
                  aria-hidden="true"
                />
                Clear vehicle information
              </span>
            </div>
          </div>
        </div>

        <div className="absolute right-5 bottom-5 z-10 flex items-center gap-2 sm:right-8 sm:bottom-8">
          {heroImages.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActiveHeroImage(index)}
              aria-label={`Show car image ${index + 1}`}
              aria-pressed={activeHeroImage === index}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeHeroImage === index
                  ? 'w-8 bg-emerald-500'
                  : 'w-2.5 bg-black/40 hover:bg-emerald-400 dark:bg-white/70'
              }`}
            />
          ))}
        </div>
      </section>

      {/* Featured Cars — 12 Cards */}
      <section
        id="featured"
        className="scroll-mt-20 bg-base-100 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
                Our Collection
              </p>

              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Featured Cars
              </h2>

              <p className="mt-3 max-w-xl leading-7 text-base-content/65">
                Explore our selection of vehicles and compare the details that
                matter to you.
              </p>
            </div>

            <a href="#contact" className={`btn ${greenButtonClass}`}>
              Ask About a Car
              <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px]">
            <label className="input input-bordered flex w-full items-center gap-3">
              <Search
                size={19}
                className="shrink-0 opacity-60"
                aria-hidden="true"
              />

              <input
                type="search"
                className="grow"
                placeholder="Search by car name or year..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search cars by name or year"
              />
            </label>

            <select
              className="select select-bordered w-full"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              aria-label="Filter cars by category"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === 'All' ? 'All Categories' : item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {filteredCars.length === 0 && (
            <div className="rounded-2xl border border-base-300 px-5 py-14 text-center">
              <CarFront
                size={40}
                className="mx-auto text-base-content/40"
                aria-hidden="true"
              />

              <h3 className="mt-4 text-xl font-bold">No cars found</h3>

              <p className="mt-2 text-sm text-base-content/60">
                Try a different search term or category.
              </p>

              <button
                type="button"
                className={`btn btn-sm mt-5 ${greenButtonClass}`}
                onClick={() => {
                  setSearch('')
                  setCategory('All')
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          <div className="mt-10 text-center">
            <a
              href="/cars"
              className="btn btn-lg rounded-xl border-emerald-600 bg-emerald-600 text-white transition-colors hover:!border-emerald-700 hover:!bg-emerald-700 hover:!text-white"
            >
              View All Cars
              <ArrowRight size={19} aria-hidden="true" />
            </a>
          </div>

          <p className="mt-6 text-center text-xs leading-5 text-base-content/50">
            Vehicle details, prices and availability are sample frontend data.
            Please confirm actual showroom inventory before purchasing.
          </p>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="scroll-mt-20 bg-base-200 px-4 py-16 sm:px-6 lg:px-8 lg:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold tracking-[0.2em] text-primary uppercase">
              The BB Difference
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              A better way to find your next car
            </h2>

            <p className="mt-4 leading-7 text-base-content/65">
              We want your car-shopping experience to feel straightforward,
              informed, and comfortable from the first conversation.
            </p>
          </div>

     
<div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
  {benefits.map(({ icon: Icon, title, description }, index) => (
    <article
      key={title}
      className="group relative overflow-hidden rounded-2xl border border-base-300 bg-base-100 p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-emerald-600 hover:shadow-xl sm:p-8"
    >
      <div className="absolute top-0 right-0 h-28 w-28 translate-x-10 -translate-y-10 rounded-full bg-emerald-500/5 transition-transform duration-500 group-hover:scale-150" />

      <div className="relative flex items-center justify-between">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600/10 text-emerald-600 transition-colors duration-300 group-hover:bg-emerald-700 group-hover:text-white">
          <Icon size={27} aria-hidden="true" />
        </div>

        <span className="text-sm font-black tracking-widest text-base-content/30">
          {String(index + 1).padStart(2, '0')}
        </span>
      </div>

      <h3 className="relative mt-7 text-xl font-bold tracking-tight">
        {title}
      </h3>

      <p className="relative mt-3 text-sm leading-7 text-base-content/65">
        {description}
      </p>

      <div className="relative mt-6 h-1 w-10 rounded-full bg-emerald-600 transition-all duration-300 group-hover:w-20" />
    </article>
  ))}
</div>

        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-base-200 px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 md:flex-row md:items-center md:justify-between lg:p-12">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">
              Ready to find your next car?
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-base-content/65">
              Contact our team to ask about availability, pricing, and vehicle
              details.
            </p>
          </div>

         
<a
  href="#contact"
  className={`btn btn-lg shrink-0 ${greenButtonClass} transition-colors duration-300 hover:!border-green-800 hover:!bg-green-800 hover:!text-white`}
>
  Contact Us
  <ArrowRight size={18} aria-hidden="true" />
</a>


        </div>
      </section>
    </div>
  )
}

