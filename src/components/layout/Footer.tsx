
import { ArrowUpRight, CarFront, MapPin, Phone } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Our Cars', href: '#featured' },
  { label: 'About Us', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

const services = [
  'Quality Vehicles',
  'Car Buying Assistance',
  'Vehicle Consultation',
  'Customer Support',
]

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer
      id="contact"
   
className="scroll-mt-24 border-t border-gray-200 bg-gray-100 text-black dark:border-white/10 dark:bg-slate-950 dark:text-white"


    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8 lg:py-16">
        <div>
          <a
            href="#home"
            aria-label="BB Car House home"
            className="inline-flex items-center gap-3"
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-600 text-white">
              <CarFront size={28} aria-hidden="true" />
            </span>

            <span>
              <span className="block text-xl font-black tracking-tight">
                BB <span className="text-emerald-700 dark:text-emerald-400">Car House</span>
              </span>
              <span className="mt-1 block text-xs font-semibold tracking-[0.2em] text-black/60 uppercase dark:text-white/60">
                Find Your Next Drive
              </span>
            </span>
          </a>

          <p className="mt-5 max-w-sm text-sm leading-7 text-black/70 dark:text-white/70">
            Find your next car with confidence. Explore our collection and
            contact our team to discover the right vehicle for your needs.
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-base font-bold">Quick Links</h2>

          <ul className="space-y-3 text-sm text-black/70 dark:text-white/70">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="transition-colors hover:text-emerald-700 focus-visible:text-emerald-700 dark:hover:text-emerald-400 dark:focus-visible:text-emerald-400"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-base font-bold">Our Services</h2>

          <ul className="space-y-3 text-sm text-black/70 dark:text-white/70">
            {services.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-base font-bold">Get in Touch</h2>

          <ul className="space-y-4 text-sm text-black/70 dark:text-white/70">
            <li className="flex items-start gap-3">
              <MapPin
                size={18}
                aria-hidden="true"
                className="mt-1 shrink-0 text-emerald-700 dark:text-emerald-400"
              />
              <span>Showroom address coming soon.</span>
            </li>

            <li className="flex items-center gap-3">
              <Phone
                size={18}
                aria-hidden="true"
                className="shrink-0 text-emerald-700 dark:text-emerald-400"
              />
              <span>Contact number coming soon.</span>
            </li>
          </ul>

          <a
            href="#home"
            aria-label="Back to BB Car House home"
            className="btn btn-circle btn-outline btn-sm mt-5 border-black/25 text-black hover:border-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-white/25 dark:text-white dark:hover:border-emerald-500 dark:hover:bg-emerald-500"
          >
            <ArrowUpRight size={17} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="border-t border-black/10 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-5 text-xs text-black/60 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8 dark:text-white/60">
          <p>
            &copy; {currentYear} BB Car House. All rights reserved.
          </p>

          <a
            href="#home"
            className="inline-flex items-center gap-2 transition-colors hover:text-emerald-700 dark:hover:text-emerald-400"
          >
            Back to top
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  )
}