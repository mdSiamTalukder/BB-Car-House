import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '../context/ThemeContext'

export const metadata: Metadata = {
  title: {
    default: 'BB Car House',
    template: '%s | BB Car House',
  },
  description:
    'Find your next car with confidence. Explore the BB Car House collection and contact our team.',
  icons: {
    icon: '/favicon.svg',
  },
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}
