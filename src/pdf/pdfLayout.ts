import type { jsPDF } from 'jspdf'
import { PDF } from './theme'

export type PdfCursor = {
  y: number
}

export function setFill(
  doc: jsPDF,
  color: readonly [number, number, number],
) {
  doc.setFillColor(color[0], color[1], color[2])
}

export function setText(
  doc: jsPDF,
  color: readonly [number, number, number],
) {
  doc.setTextColor(color[0], color[1], color[2])
}

export function setDraw(
  doc: jsPDF,
  color: readonly [number, number, number],
) {
  doc.setDrawColor(color[0], color[1], color[2])
}

export function addPageFooters(doc: jsPDF, skipFirst = true) {
  const total = doc.getNumberOfPages()
  const start = skipFirst ? 2 : 1

  for (let page = start; page <= total; page += 1) {
    doc.setPage(page)
    const footerY = PDF.pageHeight - 12

    setDraw(doc, PDF.brass)
    doc.setLineWidth(0.3)
    doc.line(PDF.margin, footerY - 4, PDF.pageWidth - PDF.margin, footerY - 4)

    doc.setFont(PDF.fontMono, 'normal')
    doc.setFontSize(8)
    setText(doc, PDF.muted)
    doc.text('WAYMARK TRAVEL GUIDE', PDF.margin, footerY)
    doc.text(`Page ${page} of ${total}`, PDF.pageWidth - PDF.margin, footerY, {
      align: 'right',
    })
  }
}

export function ensureSpace(
  doc: jsPDF,
  cursor: PdfCursor,
  needed: number,
): void {
  const bottom = PDF.pageHeight - PDF.margin - 14
  if (cursor.y + needed <= bottom) return

  doc.addPage()
  cursor.y = PDF.margin + 8
  drawPageHeader(doc, cursor)
}

export function drawPageHeader(doc: jsPDF, cursor: PdfCursor) {
  setFill(doc, PDF.brass)
  doc.rect(PDF.margin, cursor.y - 6, 28, 1.2, 'F')
  cursor.y += 4
}

export function wrapText(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
): number {
  const lines = doc.splitTextToSize(text, maxWidth) as string[]
  lines.forEach((line, index) => {
    doc.text(line, x, y + index * lineHeight)
  })
  return y + lines.length * lineHeight
}

export function formatGuideDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatShortDate(date: string): string {
  return new Date(`${date}T12:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  })
}
