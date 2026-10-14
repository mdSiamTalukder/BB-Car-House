
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  
  CheckCircle2,
  ShieldCheck,
 
  Users,
} from 'lucide-react'
import Link from 'next/link'

const features = [
  {
    icon: ShieldCheck,
    number: '01',
    title: 'Trust & Transparency',
    description:
      'Clear communication and helpful guidance to make your car-buying journey more comfortable.',
  },
  {
    icon: BadgeCheck,
    number: '02',
    title: 'Quality Vehicles',
    description:
      'Explore available vehicles and compare your options to find a car that suits your needs.',
  },
  {
    icon: Users,
    number: '03',
    title: 'Customer First',
    description:
      'Your requirements matter. We are here to help you make a confident, informed decision.',
  },
]

const commitments = [
  'Helpful guidance throughout your search',
  'Vehicle options for different needs and budgets',
  'A welcoming and customer-focused experience',
]

export default function About() {
  return (
    <div className="min-h-screen overflow-hidden bg-base-100 text-base-content">
      {/* Hero */}
      {/* <section className="relative isolate overflow-hidden border-b border-base-300">
        <div className="absolute inset-0 -z-20 bg-base-200" />

        <img
          src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=2200&q=85"
          alt="Premium automobile"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/25" />

        <div className="mx-auto grid min-h-[520px] max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 sm:py-24 lg:min-h-[610px] lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
              <Sparkles size={16} aria-hidden="true" />
              <span className="text-white">GET TO KNOW US</span>
            </div>

            <h1 className="text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl lg:text-7xl">
              Driven by Trust.
              <span className="mt-2 block text-emerald-400">
                Focused on You.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/80 sm:text-lg">
              At BB Car House, finding your next car should feel exciting,
              straightforward, and personal. We are here to help you explore
              your options and move forward with confidence.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/cars"
                className="btn rounded-xl border-0 !bg-emerald-700 !text-white shadow-lg transition-colors duration-300 hover:!bg-emerald-800"
              >
                Explore Our Cars
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                href="/contact"
                className="btn rounded-xl border border-white/40 !bg-white/10 !text-white backdrop-blur-sm transition-colors duration-300 hover:!bg-white hover:!text-black"
              >
                Get in Touch
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div className="hidden justify-end lg:flex">
            <div className="max-w-xs rounded-2xl border border-white/20 bg-black/35 p-6 shadow-2xl backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <CarFront size={26} aria-hidden="true" />
              </div>

              <p className="text-xl font-bold text-white">
                Your next journey starts here.
              </p>

              <p className="mt-3 text-sm leading-6 text-white/70">
                Discover your options, ask questions, and find a vehicle that
                fits your lifestyle.
              </p>

              <div className="mt-5 h-1 w-16 rounded-full bg-emerald-500" />
            </div>
          </div>
        </div>

        <div className="absolute right-0 bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />
      </section> */}

      {/* Our Story */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="relative">
            <div className="absolute -top-4 -left-4 h-24 w-24 rounded-tl-3xl border-t-2 border-l-2 border-emerald-600/60" />

            <div className="relative overflow-hidden rounded-3xl border border-base-300 bg-base-200 shadow-xl">
              <img
                src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=85"
                alt="A stylish car representing the driving experience"
                loading="lazy"
                className="aspect-[5/4] w-full object-cover transition-transform duration-700 hover:scale-105"
              />

              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16 sm:p-8 sm:pt-20">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-400">
                  BB Car House
                </p>
                <p className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                  More than a showroom.
                </p>
                <p className="mt-2 text-sm text-white/80">
                  A better way to find your next car.
                </p>
              </div>
            </div>

            <div className="absolute -right-2 -bottom-5 flex items-center gap-3 rounded-2xl border border-base-300 bg-base-100 p-4 shadow-xl sm:-right-5 sm:p-5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
                <ShieldCheck size={25} aria-hidden="true" />
              </div>
              <div>
                <p className="font-bold">Confidence First</p>
                <p className="mt-1 text-xs text-base-content/60">
                  Your needs come first
                </p>
              </div>
            </div>
          </div>

          <div className="pt-5 lg:pt-0">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-emerald-600">
              OUR STORY
            </p>

            <h2 className="text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
              Helping You Find
              <span className="block text-emerald-600">
                the Right Drive.
              </span>
            </h2>

            <p className="mt-6 leading-8 text-base-content/70">
              Choosing a car is an important decision. It is about more than
              the vehicle itself—it is about your lifestyle, your plans, and
              your budget.
            </p>

            <p className="mt-4 leading-8 text-base-content/70">
              At BB Car House, our goal is to make the process easier by
              helping you explore available vehicles, compare your choices,
              and get the information you need before making a decision.
            </p>

            <div className="mt-7 space-y-4">
              {commitments.map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0 text-emerald-600"
                    aria-hidden="true"
                  />
                  <p className="leading-6 text-base-content/80">{item}</p>
                </div>
              ))}
            </div>

            <Link
              href="/cars"
              className="group mt-8 inline-flex items-center gap-2 font-bold text-emerald-700 transition-colors duration-300 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Find Your Next Car
              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-base-300 bg-base-200/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="mb-4 text-sm font-bold uppercase tracking-[0.22em] text-emerald-600">
              WHY BB CAR HOUSE
            </p>

            <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
              Built Around What
              <span className="block text-emerald-600">Matters to You.</span>
            </h2>

            <p className="mt-5 leading-7 text-base-content/65">
              A helpful car-buying experience starts with listening, clear
              communication, and understanding what you are looking for.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3 lg:mt-16">
            {features.map(({ icon: Icon, number, title, description }) => (
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
                    {number}
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

      {/* Closing CTA */}
      <section className="px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl border border-base-300 bg-white px-6 py-12 text-black shadow-xl dark:bg-emerald-800 dark:text-white sm:px-10 sm:py-16 lg:px-16 lg:py-20">
          <div className="absolute -top-24 -right-16 h-72 w-72 rounded-full border-[40px] border-white/5" />
          <div className="absolute -right-8 -bottom-36 h-72 w-72 rounded-full bg-emerald-600/30 blur-3xl" />

          <div className="relative flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-emerald-200">
                YOUR NEXT CHAPTER
              </p>

              <h2 className="text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                Ready to Find Your Next Car?
              </h2>

              <p className="mt-5 max-w-xl leading-7 text-white/80">
                Explore the available cars or contact our team to discuss what
                you are looking for.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/cars"
                className="btn rounded-xl border-0 !bg-white !text-emerald-900 transition-colors duration-300 hover:!bg-emerald-100"
              >
                Browse Cars
                <ArrowRight size={18} aria-hidden="true" />
              </Link>

              <Link
                href="/contact"
                className="btn rounded-xl border border-white/40 !bg-transparent !text-white transition-colors duration-300 hover:!border-white hover:!bg-emerald-950"
              >
                Contact Us
                <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
