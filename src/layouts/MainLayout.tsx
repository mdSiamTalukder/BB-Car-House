
import type { ReactNode } from 'react'
import Footer from '../components/layout/Footer'
import Navbar from '../components/layout/Navbar'

type MainLayoutProps = {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  )
}