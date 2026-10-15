import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import LoginForm from '@/components/admin/LoginForm'
import { getAdminSession } from '@/lib/adminAuth'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Admin Sign In',
}

export default async function AdminLoginPage(
  props: PageProps<'/admin/login'>,
) {
  const user = await getAdminSession()

  if (user) {
    redirect('/admin')
  }

  const { from } = await props.searchParams
  const redirectTo =
    typeof from === 'string' && from.startsWith('/admin') ? from : '/admin'

  return (
    <main className="flex min-h-screen items-center justify-center bg-base-200 px-4 py-10 text-base-content">
      <Suspense fallback={null}>
        <LoginForm redirectTo={redirectTo} />
      </Suspense>
    </main>
  )
}
