/** Shared keyboard focus ring styles for design-system consistency. */
export const focusRingOnInk =
  'outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-ink'

export const focusRingOnParchment =
  'outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 focus-visible:ring-offset-parchment'

/** Section layout tuned for 375px+ viewports. */
export const pageSection =
  'mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-12'

export const pageHeading =
  'mt-2 font-display text-3xl font-semibold text-parchment sm:text-4xl lg:text-5xl'

/** Visually hidden but available to screen readers. */
export const visuallyHidden =
  'absolute size-px overflow-hidden whitespace-nowrap border-0 p-0 [-webkit-clip-path:inset(50%)] [clip-path:inset(50%)]'

/** Skip navigation link — visible on keyboard focus. */
export const skipLinkClass =
  `${visuallyHidden} focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:flex focus:size-auto focus:items-center focus:overflow-visible focus:rounded-xl focus:bg-brass focus:px-4 focus:py-3 focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:text-ink focus:[clip-path:none] focus-visible:ring-2 focus-visible:ring-parchment focus-visible:ring-offset-2 focus-visible:ring-offset-ink`

/** Tab panel wrapper with consistent a11y attributes. */
export function tabPanelProps(tabId: string, labelledBy: string, hidden: boolean) {
  return {
    id: `tabpanel-${tabId}`,
    role: 'tabpanel' as const,
    'aria-labelledby': labelledBy,
    hidden,
    tabIndex: hidden ? -1 : 0,
  }
}

export function tabId(tab: string) {
  return `tab-${tab}`
}
