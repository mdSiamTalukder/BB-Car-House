import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../context/ThemeContext'
import MainLayout from '../layouts/MainLayout'

export const metadata: Metadata = {
  title: 'bb-car-house',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <MainLayout>{children}</MainLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}
