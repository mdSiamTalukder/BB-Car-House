import type { ComponentType, ReactNode } from 'react'
import { AlertTriangle, Inbox, RefreshCw, type LucideIcon } from 'lucide-react'

export function AdminPageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-base-content/60">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = 'default',
}: {
  icon: LucideIcon
  label: string
  value: ReactNode
  hint?: string
  tone?: 'default' | 'success' | 'warning' | 'info'
}) {
  const toneClass = {
    default: 'bg-base-200 text-base-content',
    success: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-300',
    warning: 'bg-amber-500/15 text-amber-700 dark:text-amber-300',
    info: 'bg-sky-500/10 text-sky-700 dark:text-sky-300',
  }[tone]

  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-base-content/60">
          {label}
        </span>
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${toneClass}`}
        >
          <Icon size={20} aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-base-content/50">{hint}</p>}
    </div>
  )
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-base-300/60 ${className}`}
      aria-hidden="true"
    />
  )
}

export function ErrorState({
  message,
  onRetry,
}: {
  message: string
  onRetry?: () => void
}) {
  return (
    <div className="rounded-2xl border border-red-500/30 bg-red-500/5 p-8 text-center">
      <AlertTriangle
        size={36}
        className="mx-auto text-red-500"
        aria-hidden="true"
      />
      <h3 className="mt-3 text-lg font-bold">Something went wrong</h3>
      <p className="mt-1 text-sm text-base-content/65">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="btn btn-outline btn-sm mt-4"
        >
          <RefreshCw size={15} aria-hidden="true" />
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
}: {
  title: string
  description?: string
  icon?: ComponentType<{ size?: number; className?: string }>
  action?: ReactNode
}) {
  return (
    <div className="rounded-2xl border border-base-300 bg-base-100 p-10 text-center">
      <Icon
        size={40}
        className="mx-auto text-base-content/30"
        aria-hidden="true"
      />
      <h3 className="mt-4 text-lg font-bold">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-base-content/60">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
