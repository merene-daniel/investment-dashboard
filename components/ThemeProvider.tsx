'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

const ThemeContext = createContext<{
  theme: Theme
  toggle: () => void
}>({ theme: 'dark', toggle: () => {} })

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')

  // Sync initial value from DOM attribute (set by anti-flash script)
  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme')
    if (attr === 'light') setTheme('light')
  }, [])

  // Apply theme to <html> and persist
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('armor-theme', theme) } catch (_) {}
  }, [theme])

  return (
    <ThemeContext.Provider value={{
      theme,
      toggle: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
