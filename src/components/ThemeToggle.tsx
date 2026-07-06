import { useTheme } from '../hooks/useTheme'
import { focusRingOnInk } from '../utils/a11y'

export default function ThemeToggle() {
  const { isMidnight, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`shrink-0 rounded-lg p-2 text-parchment/70 motion-safe:transition-colors hover:bg-parchment/10 hover:text-parchment ${focusRingOnInk}`}
      aria-label={isMidnight ? 'Switch to standard theme' : 'Switch to midnight theme'}
      title={isMidnight ? 'Standard theme' : 'Midnight theme'}
    >
      {isMidnight ? (
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
        </svg>
      ) : (
        <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      )}
    </button>
  )
}
