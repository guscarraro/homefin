import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { darkTheme, lightTheme } from '../styles/theme'
import { useLocalStorage } from '../hooks/useLocalStorage'

const ThemeModeContext = createContext(null)

export function ThemeProviderWrapper({ children }) {
  const [storedTheme, setStoredTheme] = useLocalStorage('homefin:theme', 'dark')
  const [mode, setMode] = useState(storedTheme)

  const toggleTheme = useCallback(() => {
    const nextMode = mode === 'dark' ? 'light' : 'dark'
    setMode(nextMode)
    setStoredTheme(nextMode)
  }, [mode, setStoredTheme])

  const value = useMemo(() => ({ mode, toggleTheme }), [mode, toggleTheme])
  const theme = mode === 'dark' ? darkTheme : lightTheme

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeModeContext.Provider>
  )
}

export function useThemeMode() {
  return useContext(ThemeModeContext)
}
