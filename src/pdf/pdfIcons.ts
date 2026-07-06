import type { jsPDF } from 'jspdf'
import { PDF } from './theme'
import { setFill, setDraw } from './pdfLayout'

export type GuideIcon =
  | 'summary'
  | 'itinerary'
  | 'budget'
  | 'weather'
  | 'packing'
  | 'hotel'
  | 'emergency'
  | 'tips'
  | 'police'
  | 'medical'
  | 'embassy'
  | 'general'

export function drawIcon(
  doc: jsPDF,
  icon: GuideIcon,
  x: number,
  y: number,
  size = 8,
) {
  setFill(doc, PDF.brass)
  doc.circle(x + size / 2, y + size / 2, size / 2, 'F')

  doc.setFont(PDF.fontBody, 'bold')
  doc.setFontSize(size * 1.5)
  doc.setTextColor(PDF.ink[0], PDF.ink[1], PDF.ink[2])

  const glyph: Record<GuideIcon, string> = {
    summary: 'S',
    itinerary: 'D',
    budget: 'B',
    weather: 'W',
    packing: 'P',
    hotel: 'H',
    emergency: '!',
    tips: 'T',
    police: 'P',
    medical: '+',
    embassy: 'E',
    general: 'i',
  }

  doc.text(glyph[icon], x + size / 2, y + size * 0.72, { align: 'center' })
}

export function drawSectionRule(doc: jsPDF, y: number, width = PDF.contentWidth) {
  setDraw(doc, PDF.brass)
  doc.setLineWidth(0.6)
  doc.line(PDF.margin, y, PDF.margin + width, y)
  setDraw(doc, PDF.teal)
  doc.setLineWidth(0.2)
  doc.line(PDF.margin, y + 1.5, PDF.margin + width * 0.35, y + 1.5)
}

export function drawAccentBar(doc: jsPDF, x: number, y: number, height: number) {
  setFill(doc, PDF.brass)
  doc.rect(x, y, 2.5, height, 'F')
}
