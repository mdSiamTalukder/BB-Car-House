'use client'

import {
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { ThemeContext } from './theme-context'
import { THEME_STORAGE_KEY, type Theme } from './theme'

const THEME_CHANGE_EVENT = 'bb-car-house-theme-change'

// localStorage is the store; this keeps the current value when it is
// unavailable so that theme switching still works.
let memoryTheme: Theme = 'light'

function readTheme(): Theme {
  try {
    const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)

    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
  } catch {
    // Use light mode if browser storage is unavailable.
  }

  return memoryTheme
}

function writeTheme(theme: Theme) {
  memoryTheme = theme

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme)
  } catch {
    // Theme switching still works if storage is unavailable.
  }
}

function getServerTheme(): Theme {
  return 'light'
}

function subscribeToTheme(onStoreChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onStoreChange)

  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onStoreChange)
  }
}

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useSyncExternalStore(
    subscribeToTheme,
    readTheme,
    getServerTheme,
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  function toggleTheme() {
    writeTheme(theme === 'light' ? 'dark' : 'light')
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
