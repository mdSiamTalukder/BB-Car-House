
import { useState } from 'react'
import {
  ArrowUpRight,
  CarFront,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import { useTheme } from '../../context/useTheme'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Our Cars', href: '/cars' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  const themeLabel =
    theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'

  return (
    <header className="sticky top-0 z-50 border-b border-base-300 bg-base-100">
      <nav
        className="navbar mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link
          to="/"
          className="flex min-w-0 items-center gap-3"
          aria-label="BB Car House home"
          onClick={() => setIsMenuOpen(false)}
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-content">
            <CarFront size={26} aria-hidden="true" />
          </span>

          <span className="min-w-0 leading-tight">
            <span className="block text-lg font-black tracking-tight sm:text-xl">
              BB Car House
            </span>
            <span className="mt-1 block text-[10px] font-medium tracking-wider text-base-content/70 uppercase">
              Find Your Next Drive
            </span>
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? 'text-primary' : 'text-base-content'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}

          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === 'light' ? (
              <Moon size={19} aria-hidden="true" />
            ) : (
              <Sun size={19} aria-hidden="true" />
            )}
          </button>



<Link
  to="/contact"
  className="btn btn-sm border border-base-300 transition-colors duration-300 hover:!border-green-800 hover:!bg-green-800 hover:!text-white dark:border-gray-700"
  style={{
    backgroundColor: 'var(--contact-btn-bg)',
    color: 'var(--contact-btn-text)',
  }}
>
  Contact Us
  <ArrowUpRight size={16} aria-hidden="true" />
</Link>






        </div>

        <div className="ml-auto flex items-center gap-1 md:hidden">
          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm"
            onClick={toggleTheme}
            aria-label={themeLabel}
            title={themeLabel}
          >
            {theme === 'light' ? (
              <Moon size={19} aria-hidden="true" />
            ) : (
              <Sun size={19} aria-hidden="true" />
            )}
          </button>

          <button
            type="button"
            className="btn btn-ghost btn-square btn-sm"
            aria-label={
              isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'
            }
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? (
              <X size={23} aria-hidden="true" />
            ) : (
              <Menu size={23} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          className="border-t border-base-300 bg-base-100 px-4 py-4 md:hidden"
        >
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-base-200 hover:text-primary ${
                    isActive ? 'bg-base-200 text-primary' : 'text-base-content'
                  }`
                }
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <Link
              to="/contact"
              className="btn btn-primary mt-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact Us
              <ArrowUpRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

