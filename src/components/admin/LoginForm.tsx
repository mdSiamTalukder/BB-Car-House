'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { CarFront, Lock, LogIn, Mail } from 'lucide-react'

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        }),
      })

      const body = await response.json().catch(() => null)

      if (!response.ok) {
        setError(body?.message ?? 'Sign in failed. Please try again.')
        setSubmitting(false)
        return
      }

      router.replace(redirectTo || '/admin')
      router.refresh()
    } catch {
      setError('Network error. Please check your connection and try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-base-300 bg-base-100 p-6 shadow-lg sm:p-8">
      <div className="mb-7 flex flex-col items-center text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-600 text-white">
          <CarFront size={28} aria-hidden="true" />
        </span>
        <h1 className="mt-4 text-2xl font-black tracking-tight">
          Admin Sign In
        </h1>
        <p className="mt-1 text-sm text-base-content/60">
          Sign in to manage cars and enquiries.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid gap-5">
        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Email</span>
          <div className="input input-bordered flex items-center gap-2 bg-base-200/20 focus-within:border-emerald-600">
            <Mail size={17} className="opacity-60" aria-hidden="true" />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="admin@example.com"
              className="grow bg-transparent outline-none"
            />
          </div>
        </label>

        <label className="form-control w-full">
          <span className="label-text mb-2 font-semibold">Password</span>
          <div className="input input-bordered flex items-center gap-2 bg-base-200/20 focus-within:border-emerald-600">
            <Lock size={17} className="opacity-60" aria-hidden="true" />
            <input
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="grow bg-transparent outline-none"
            />
          </div>
        </label>

        <button
          type="submit"
          disabled={submitting}
          className="btn border-emerald-700 bg-emerald-700 text-white transition-colors hover:border-emerald-800 hover:bg-emerald-800 disabled:opacity-60"
        >
          {submitting ? 'Signing in...' : 'Sign In'}
          <LogIn size={17} aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
