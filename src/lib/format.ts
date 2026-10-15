export function formatPrice(value: number): string {
  return `৳ ${value.toLocaleString('en-BD')}`
}

export function formatNumber(value: number): string {
  return value.toLocaleString('en-BD')
}

export function formatDate(value: string | Date): string {
  return new Date(value).toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatDateTime(value: string | Date): string {
  return new Date(value).toLocaleString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const CAR_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: 'Available',
  RESERVED: 'Reserved',
  SOLD: 'Sold',
}

export const INQUIRY_STATUS_LABELS: Record<string, string> = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  CLOSED: 'Closed',
}

export const CAR_CATEGORIES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Luxury',
  'Pickup',
  'Van',
  'Coupe',
  'Other',
]
