/** Waymark PDF design tokens (mm, RGB 0–255). */
export const PDF = {
  pageWidth: 210,
  pageHeight: 297,
  margin: 20,
  contentWidth: 170,

  ink: [21, 36, 56] as const,
  parchment: [244, 238, 221] as const,
  brass: [201, 154, 61] as const,
  rust: [177, 80, 47] as const,
  teal: [62, 98, 89] as const,
  muted: [100, 115, 130] as const,

  fontDisplay: 'times',
  fontBody: 'helvetica',
  fontMono: 'courier',
} as const

export const PACKING_LABELS: Record<string, string> = {
  documents: 'Documents',
  clothing: 'Clothing',
  electronics: 'Electronics',
  medicine: 'Medicine',
  accessories: 'Accessories',
  essentials: 'Essentials',
}
