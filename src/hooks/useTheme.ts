import { useCallback, useEffect, useState } from 'react'
import {
  applyTheme,
  loadTheme,
  saveTheme,
  type ThemeMode,
} from '../utils/themeStorage'

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeMode>(() => loadTheme())

  useEffect(() => {
    applyTheme(theme)
    saveTheme(theme)
  }, [theme])

  const setTheme = useCallback((next: ThemeMode) => {
    setThemeState(next)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === 'waymark' ? 'midnight' : 'waymark'))
  }, [])

  return { theme, setTheme, toggleTheme, isMidnight: theme === 'midnight' }
}
