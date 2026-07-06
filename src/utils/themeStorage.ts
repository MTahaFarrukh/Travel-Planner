export type ThemeMode = 'waymark' | 'midnight'

const STORAGE_KEY = 'waymark-theme'

export function loadTheme(): ThemeMode {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'midnight' || stored === 'waymark') return stored
  } catch {
    // ignore
  }
  return 'waymark'
}

export function saveTheme(theme: ThemeMode) {
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    // ignore
  }
}

export function applyTheme(theme: ThemeMode) {
  document.documentElement.dataset.theme = theme
}
