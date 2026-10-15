import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import AdminShell from '@/components/admin/AdminShell'
import { getAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin',
}

/**
 * Server-side authorization gate for every admin dashboard page. Proxy only
 * checks for the presence of the cookie; this verifies it against the API.
 */
export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode
}) {
  const user = await getAdminSession()

  if (!user) {
    redirect('/admin/login')
  }

  return <AdminShell user={user}>{children}</AdminShell>
}
