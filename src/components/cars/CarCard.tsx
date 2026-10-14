
import {
  ArrowUpRight,
  Fuel,
  Gauge,
  Settings2,
} from 'lucide-react'

export type Car = {
  id: number
  name: string
  year: number
  price: number
  mileage: string
  fuel: string
  transmission: string
  category: string
  image: string
  featured?: boolean
}

type CarCardProps = {
  car: Car
}

const greenButtonClass =
  '!border-white !bg-white !text-black shadow-sm transition-colors duration-200 hover:!border-green-800 hover:!bg-green-800 hover:!text-white dark:!border-white dark:!bg-black dark:!text-white dark:hover:!border-green-800 dark:hover:!bg-green-800 dark:hover:!text-white'

export default function CarCard({ car }: CarCardProps) {
  return (
    <article className="group card h-full overflow-hidden border border-[#60A5FA] bg-base-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-[#60A5FA]">
      {/* Car Image */}
      <figure className="relative aspect-[16/10] overflow-hidden bg-base-200">
        <img
          src={car.image}
          alt={`${car.year} ${car.name}`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/5" />
      </figure>

      {/* Car Information */}
      <div className="card-body flex flex-1 gap-4 p-4 sm:p-5">
        <div>
          <h3 className="mt-2 text-lg leading-snug font-bold text-base-content transition-colors duration-300 hover:!text-green-600 sm:text-xl">
            {car.name}
          </h3>

          <p className="mt-3 text-2xl font-black tracking-tight text-[#047857] dark:text-[#93C5FD]">
            ৳ {car.price.toLocaleString('en-BD')}
          </p>
        </div>

        {/* Vehicle Specifications — Borders Removed */}
        <div className="grid grid-cols-3 gap-2 rounded-xl bg-base-200/60 px-2 py-4 sm:gap-3 sm:px-3">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <Gauge
              size={19}
              className="shrink-0 text-[#047857] dark:text-white"
              aria-hidden="true"
            />
            <span className="text-xs leading-5 text-base-content/75">
              {car.mileage}
            </span>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-2 px-1 text-center">
            <Fuel
              size={19}
              className="shrink-0 text-[#047857] dark:text-white"
              aria-hidden="true"
            />
            <span className="text-xs leading-5 text-base-content/75">
              {car.fuel}
            </span>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <Settings2
              size={19}
              className="shrink-0 text-[#047857] dark:text-white"
              aria-hidden="true"
            />
            <span className="text-xs leading-5 text-base-content/75">
              {car.transmission}
            </span>
          </div>
        </div>

        {/* Action */}
        <a
          href="#contact"
          className={`btn mt-auto w-full rounded-xl font-semibold shadow-sm transition-colors ${greenButtonClass}`}
        >
          Inquire About Car
          <ArrowUpRight size={18} aria-hidden="true" />
        </a>
      </div>
    </article>
  )
}

