'use client'

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  CheckCircle2,
  ImagePlus,
  Loader2,
  Save,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { adminFetch } from '../../lib/adminClient'
import type { CarDto } from '../../lib/types'
import { CAR_CATEGORIES, formatPrice } from '../../lib/format'
import { ErrorState, Skeleton } from './ui'

type CarFormValues = {
  title: string
  brand: string
  model: string
  category: string
  year: string
  price: string
  mileage: string
  fuelType: string
  transmission: string
  condition: string
  description: string
  status: string
  featured: boolean
  isPublished: boolean
}

const emptyValues: CarFormValues = {
  title: '',
  brand: '',
  model: '',
  category: '',
  year: String(new Date().getFullYear()),
  price: '',
  mileage: '0',
  fuelType: '',
  transmission: '',
  condition: '',
  description: '',
  status: 'AVAILABLE',
  featured: false,
  isPublished: true,
}

const inputClass =
  'input input-bordered w-full bg-base-100 outline-none focus:border-emerald-600 focus:outline-none'
const labelClass = 'label-text mb-1.5 font-semibold'

function fromCar(car: CarDto): CarFormValues {
  return {
    title: car.title,
    brand: car.brand,
    model: car.model,
    category: car.category ?? '',
    year: String(car.year),
    price: String(car.price),
    mileage: String(car.mileage),
    fuelType: car.fuelType ?? '',
    transmission: car.transmission ?? '',
    condition: car.condition ?? '',
    description: car.description ?? '',
    status: car.status,
    featured: car.featured,
    isPublished: car.isPublished,
  }
}

function buildPayload(values: CarFormValues) {
  return {
    title: values.title.trim(),
    brand: values.brand.trim(),
    model: values.model.trim(),
    category: values.category.trim() || undefined,
    year: Number(values.year),
    price: Number(values.price),
    mileage: values.mileage === '' ? 0 : Number(values.mileage),
    fuelType: values.fuelType.trim() || undefined,
    transmission: values.transmission.trim() || undefined,
    condition: values.condition.trim() || undefined,
    description: values.description.trim() || undefined,
    status: values.status,
    featured: values.featured,
    isPublished: values.isPublished,
  }
}

export default function CarForm({
  mode,
  carId,
}: {
  mode: 'create' | 'edit'
  carId?: string
}) {
  const router = useRouter()
  const [values, setValues] = useState<CarFormValues>(emptyValues)
  const [car, setCar] = useState<CarDto | null>(null)
  const [loading, setLoading] = useState(mode === 'edit')
  const [loadError, setLoadError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    if (mode !== 'edit' || !carId) return

    let active = true

    async function loadCar() {
      const response = await adminFetch<{ car: CarDto }>(`cars/${carId}`)
      if (!active) return

      if (!response.ok || !response.data) {
        setLoadError(response.message || 'Unable to load this car.')
      } else {
        setCar(response.data.car)
        setValues(fromCar(response.data.car))
        setLoadError('')
      }

      setLoading(false)
    }

    void loadCar()

    return () => {
      active = false
    }
  }, [mode, carId, reloadKey])

  function reloadCar() {
    setLoading(true)
    setReloadKey((key) => key + 1)
  }

  function update<K extends keyof CarFormValues>(
    key: K,
    value: CarFormValues[K],
  ) {
    setValues((current) => ({ ...current, [key]: value }))
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setFiles(Array.from(event.target.files ?? []))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const payload = buildPayload(values)

    try {
      let response

      if (mode === 'create') {
        if (files.length > 0) {
          const formData = new FormData()
          for (const [key, value] of Object.entries(payload)) {
            if (value !== undefined) formData.append(key, String(value))
          }
          for (const file of files) formData.append('images', file)
          response = await adminFetch<{ car: CarDto }>('cars', {
            method: 'POST',
            body: formData,
          })
        } else {
          response = await adminFetch<{ car: CarDto }>('cars', {
            method: 'POST',
            body: JSON.stringify(payload),
          })
        }
      } else {
        response = await adminFetch<{ car: CarDto }>(`cars/${carId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok || !response.data) {
        setError(response.message || 'Could not save the car.')
        setSaving(false)
        return
      }

      if (mode === 'create') {
        router.push('/admin/cars')
        router.refresh()
        return
      }

      setCar(response.data.car)
      setValues(fromCar(response.data.car))
      setFiles([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      setSuccess('Changes saved successfully.')
      setSaving(false)
    } catch {
      setError('Network error. Please try again.')
      setSaving(false)
    }
  }

  async function uploadImages() {
    if (mode !== 'edit' || !carId || files.length === 0) return

    setUploading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    for (const file of files) formData.append('images', file)

    const response = await adminFetch<{ car: CarDto }>(`cars/${carId}/images`, {
      method: 'POST',
      body: formData,
    })

    if (response.ok && response.data) {
      setCar(response.data.car)
      setFiles([])
      if (fileInputRef.current) fileInputRef.current.value = ''
      setSuccess('Images uploaded.')
    } else {
      setError(response.message || 'Could not upload images.')
    }

    setUploading(false)
  }

  async function removeImage(imageId: string) {
    if (mode !== 'edit' || !carId) return

    const confirmed = window.confirm('Remove this image?')
    if (!confirmed) return

    const response = await adminFetch<{ car: CarDto }>(
      `cars/${carId}/images/${imageId}`,
      { method: 'DELETE' },
    )

    if (response.ok && response.data) {
      setCar(response.data.car)
    } else {
      setError(response.message || 'Could not remove the image.')
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-96" />
      </div>
    )
  }

  if (loadError) {
    return <ErrorState message={loadError} onRetry={reloadCar} />
  }

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/cars"
          className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
        >
          <ArrowLeft size={16} aria-hidden="true" />
          Back to cars
        </Link>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          {mode === 'create' ? 'Add a Car' : `Edit ${car?.title ?? 'Car'}`}
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          {mode === 'create'
            ? 'Add a vehicle to your inventory.'
            : 'Update the details for this vehicle.'}
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-600/30 bg-emerald-600/10 p-4 text-sm"
        >
          <CheckCircle2 size={17} className="text-emerald-600" aria-hidden="true" />
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]"
      >
        {/* Main details */}
        <section className="space-y-5 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="form-control sm:col-span-2">
              <span className={labelClass}>Title *</span>
              <input
                type="text"
                required
                minLength={3}
                maxLength={160}
                value={values.title}
                onChange={(event) => update('title', event.target.value)}
                placeholder="e.g. Toyota Corolla Axio 2022"
                className={inputClass}
              />
            </label>

            <label className="form-control">
              <span className={labelClass}>Brand *</span>
              <input
                type="text"
                required
                value={values.brand}
                onChange={(event) => update('brand', event.target.value)}
                placeholder="Toyota"
                className={inputClass}
              />
            </label>

            <label className="form-control">
              <span className={labelClass}>Model *</span>
              <input
                type="text"
                required
                value={values.model}
                onChange={(event) => update('model', event.target.value)}
                placeholder="Corolla Axio"
                className={inputClass}
              />
            </label>

            <label className="form-control">
              <span className={labelClass}>Category</span>
              <input
                type="text"
                list="car-categories"
                value={values.category}
                onChange={(event) => update('category', event.target.value)}
                placeholder="Sedan"
                className={inputClass}
              />
              <datalist id="car-categories">
                {CAR_CATEGORIES.map((category) => (
                  <option key={category} value={category} />
                ))}
              </datalist>
            </label>

            <label className="form-control">
              <span className={labelClass}>Year *</span>
              <input
                type="number"
                required
                min={1900}
                max={new Date().getFullYear() + 1}
                value={values.year}
                onChange={(event) => update('year', event.target.value)}
                className={inputClass}
              />
            </label>

            <label className="form-control">
              <span className={labelClass}>Price (৳) *</span>
              <input
                type="number"
                required
                min={1}
                value={values.price}
                onChange={(event) => update('price', event.target.value)}
                placeholder="2450000"
                className={inputClass}
              />
            </label>

            <label className="form-control">
              <span className={labelClass}>Mileage (km)</span>
              <input
                type="number"
                min={0}
                value={values.mileage}
                onChange={(event) => update('mileage', event.target.value)}
                className={inputClass}
              />
            </label>

            <label className="form-control">
              <span className={labelClass}>Fuel Type</span>
              <input
                type="text"
                value={values.fuelType}
                onChange={(event) => update('fuelType', event.target.value)}
                placeholder="Petrol / Hybrid / Diesel"
                className={inputClass}
              />
            </label>

            <label className="form-control">
              <span className={labelClass}>Transmission</span>
              <input
                type="text"
                value={values.transmission}
                onChange={(event) => update('transmission', event.target.value)}
                placeholder="Automatic / Manual"
                className={inputClass}
              />
            </label>

            <label className="form-control">
              <span className={labelClass}>Condition</span>
              <input
                type="text"
                value={values.condition}
                onChange={(event) => update('condition', event.target.value)}
                placeholder="Used / New / Reconditioned"
                className={inputClass}
              />
            </label>

            <label className="form-control sm:col-span-2">
              <span className={labelClass}>Description</span>
              <textarea
                value={values.description}
                onChange={(event) => update('description', event.target.value)}
                rows={5}
                maxLength={8000}
                placeholder="Share key details about this vehicle..."
                className="textarea textarea-bordered w-full bg-base-100 leading-7 outline-none focus:border-emerald-600 focus:outline-none"
              />
            </label>
          </div>
        </section>

        {/* Sidebar controls */}
        <aside className="space-y-5">
          <section className="space-y-4 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold">Publication</h2>

            <label className="form-control">
              <span className={labelClass}>Status</span>
              <select
                value={values.status}
                onChange={(event) => update('status', event.target.value)}
                className="select select-bordered w-full bg-base-100"
              >
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="SOLD">Sold</option>
              </select>
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-medium">
                Published on website
              </span>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={values.isPublished}
                onChange={(event) =>
                  update('isPublished', event.target.checked)
                }
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-3">
              <span className="text-sm font-medium">Featured</span>
              <input
                type="checkbox"
                className="toggle toggle-success"
                checked={values.featured}
                onChange={(event) => update('featured', event.target.checked)}
              />
            </label>
          </section>

          <section className="space-y-3 rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
            <h2 className="text-sm font-bold">Images</h2>

            {mode === 'edit' && car && car.images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {car.images.map((image) => (
                  <div
                    key={image.id}
                    className="group relative overflow-hidden rounded-lg border border-base-300"
                  >
                    <img
                      src={image.url}
                      alt=""
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute top-1 right-1 btn btn-circle btn-xs btn-error"
                      aria-label="Remove image"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-base-300 px-4 py-6 text-center transition-colors hover:border-emerald-600/50">
              <UploadCloud size={24} className="text-base-content/50" aria-hidden="true" />
              <span className="text-sm font-medium">
                {files.length > 0
                  ? `${files.length} file(s) selected`
                  : 'Choose images'}
              </span>
              <span className="text-xs text-base-content/50">
                JPG, PNG, WebP or AVIF · up to 10 files
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                multiple
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {mode === 'edit' && files.length > 0 && (
              <button
                type="button"
                onClick={uploadImages}
                disabled={uploading}
                className="btn btn-outline btn-sm w-full"
              >
                {uploading ? (
                  <Loader2 size={15} className="animate-spin" aria-hidden="true" />
                ) : (
                  <ImagePlus size={15} aria-hidden="true" />
                )}
                Upload selected images
              </button>
            )}

            <p className="text-xs leading-5 text-base-content/50">
              Image uploads require Cloudinary to be configured on the API. If
              it is not configured, saving text details still works.
            </p>
          </section>

          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary w-full"
          >
            {saving ? (
              <Loader2 size={17} className="animate-spin" aria-hidden="true" />
            ) : (
              <Save size={17} aria-hidden="true" />
            )}
            {mode === 'create' ? 'Create Car' : 'Save Changes'}
          </button>

          {mode === 'edit' && car && (
            <p className="text-center text-xs text-base-content/45">
              Current price: {formatPrice(car.price)}
            </p>
          )}
        </aside>
      </form>
    </div>
  )
}
