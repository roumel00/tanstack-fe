import { createContext, useContext, useEffect, useState } from 'react'
import { useToggleTheme } from '@/queries'

type Theme = 'light' | 'dark'

type ThemeProviderState = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: 'light',
  toggleTheme: () => null,
})

export function ThemeProvider({
  children,
  initialTheme = 'light',
}: {
  children: React.ReactNode
  initialTheme?: Theme
}) {
  const [theme, setTheme] = useState<Theme>(initialTheme)
  const toggleThemeMutation = useToggleTheme()

  useEffect(() => {
    setTheme(initialTheme)
  }, [initialTheme])

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    toggleThemeMutation.mutate({ platform: 'web' })
  }

  return (
    <ThemeProviderContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
