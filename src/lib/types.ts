/**
 * Shared API types mirroring the Express + Prisma backend DTOs.
 *
 * These are plain types with no server-only imports so they can be used from
 * both Server and Client Components.
 */

export type Pagination = {
  page: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export type CarImage = {
  id: string
  url: string
  publicId: string
  alt: string | null
  sortOrder: number
}

export type CarDto = {
  id: string
  title: string
  slug: string
  brand: string
  model: string
  category: string | null
  year: number
  price: number
  mileage: number
  fuelType: string | null
  transmission: string | null
  condition: string | null
  description: string | null
  status: string
  featured: boolean
  isPublished: boolean
  images: CarImage[]
  createdAt: string
  updatedAt: string
}

export type CarFacets = {
  categories: string[]
  brands: string[]
}

export type InquiryCarSummary = {
  id: string
  title: string
  slug: string
  brand: string
  model: string
  year: number
}

export type InquiryDto = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  carId: string | null
  car: InquiryCarSummary | null
  createdAt: string
  updatedAt: string
}

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

/**
 * Public dealer contact details.
 *
 * Every field is nullable: the project ships without verified business
 * information, so the UI omits the matching link instead of inventing one.
 */
export type DealerInfo = {
  phone: string | null
  whatsapp: string | null
  email: string | null
  address: string | null
  mapUrl: string | null
}

/** Minimal, authoritative car facts used to prefill contact/enquiry flows. */
export type CarEnquiryContext = {
  id: string
  slug: string
  title: string
  brand: string
  model: string
  year: number
  price: number
}

export type DashboardRecentCar = {
  id: string
  title: string
  slug: string
  brand: string
  model: string
  category: string | null
  year: number
  price: number
  status: string
  featured: boolean
  isPublished: boolean
  mileage: number
  createdAt: string
}

export type DashboardRecentInquiry = {
  id: string
  name: string
  email: string
  phone: string | null
  message: string
  status: string
  createdAt: string
}

export type DashboardStats = {
  generatedAt: string
  cars: {
    total: number
    available: number
    reserved: number
    sold: number
    featured: number
    published: number
    unpublished: number
    averagePrice: number
    averageMileage: number
    averageYear: number
    inventoryValue: number
  }
  inquiries: {
    total: number
    new: number
    contacted: number
    closed: number
    responseRate: number
  }
  trend: {
    month: string
    carsAdded: number
    inquiriesReceived: number
    inquiriesClosed: number
    inventoryValue: number
  }[]
  recentCars: DashboardRecentCar[]
  recentInquiries: DashboardRecentInquiry[]
}

/** Shape consumed by the public `CarCard` component. */
export type CarCardData = {
  id: string
  slug: string
  name: string
  year: number
  price: number
  mileage: string
  fuel: string
  transmission: string
  category: string
  image: string
  featured?: boolean
  status: string
}
