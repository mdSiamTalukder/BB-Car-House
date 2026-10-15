'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  CarFront,
  ExternalLink,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  X,
} from 'lucide-react'
import type { AdminUser } from '../../lib/types'

const navItems = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Cars', href: '/admin/cars', icon: CarFront },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
]

function isActive(pathname: string, href: string) {
  if (href === '/admin') return pathname === '/admin'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AdminShell({
  user,
  children,
}: {
  user: AdminUser
  children: ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [signingOut, setSigningOut] = useState(false)

  async function handleSignOut() {
    setSigningOut(true)

    try {
      await fetch('/api/admin/session', { method: 'DELETE' })
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 border-b border-base-300 px-5 py-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white">
          <CarFront size={22} aria-hidden="true" />
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-sm font-black">BB Car House</p>
          <p className="text-xs text-base-content/60">Admin Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3" aria-label="Admin navigation">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? 'bg-emerald-600 text-white'
                  : 'text-base-content hover:bg-base-200'
              }`}
            >
              <Icon size={18} aria-hidden="true" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-base-300 p-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-base-content transition-colors hover:bg-base-200"
        >
          <ExternalLink size={18} aria-hidden="true" />
          View website
        </Link>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={signingOut}
          className="mt-1 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10 disabled:opacity-60 dark:text-red-400"
        >
          <LogOut size={18} aria-hidden="true" />
          {signingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-base-300 bg-base-100 px-4 py-3 lg:hidden">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-600 text-white">
            <CarFront size={20} aria-hidden="true" />
          </span>
          <span className="text-sm font-black">BB Admin</span>
        </div>

        <button
          type="button"
          className="btn btn-ghost btn-square btn-sm"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      <div className="flex">
        {/* Sidebar — desktop */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-base-300 bg-base-100 lg:block">
          {sidebar}
        </aside>

        {/* Sidebar — mobile drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              aria-label="Close menu"
              className="absolute inset-0 bg-black/40"
              onClick={() => setMenuOpen(false)}
            />
            <aside className="absolute top-0 left-0 h-full w-72 max-w-[80%] bg-base-100 shadow-xl">
              {sidebar}
            </aside>
          </div>
        )}

        <div className="flex min-h-screen w-full min-w-0 flex-col">
          {/* Desktop top bar */}
          <header className="hidden items-center justify-between border-b border-base-300 bg-base-100 px-6 py-4 lg:flex">
            <p className="text-sm text-base-content/60">
              Signed in as{' '}
              <span className="font-semibold text-base-content">
                {user.name}
              </span>
            </p>
            <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-semibold uppercase">
              {user.role}
            </span>
          </header>

          <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  )
}
