import type { EmergencyContact } from '../types/travelGuide'

const DEFAULT: EmergencyContact[] = [
  { label: 'International emergency', value: '112 (many countries)', icon: 'general' },
  { label: 'Local police', value: 'Contact hotel concierge or dial local emergency', icon: 'police' },
  { label: 'Medical assistance', value: 'Dial local ambulance — ask hotel for number', icon: 'medical' },
  { label: 'Embassy / consulate', value: 'Register with your home country embassy before travel', icon: 'embassy' },
]

const BY_COUNTRY: Record<string, EmergencyContact[]> = {
  Japan: [
    { label: 'Police', value: '110', icon: 'police' },
    { label: 'Ambulance / Fire', value: '119', icon: 'medical' },
    { label: 'Tourist hotline', value: '050-3816-2787', icon: 'general' },
    { label: 'Embassy', value: 'Contact your home embassy in Tokyo or Osaka', icon: 'embassy' },
  ],
  Indonesia: [
    { label: 'Police', value: '110', icon: 'police' },
    { label: 'Medical', value: '118 / 119', icon: 'medical' },
    { label: 'Tourist police (Bali)', value: '+62 361 754 599', icon: 'general' },
    { label: 'Embassy', value: 'Contact your home embassy in Jakarta or Denpasar', icon: 'embassy' },
  ],
  Canada: [
    { label: 'Emergency', value: '911', icon: 'general' },
    { label: 'Park emergency (Banff)', value: '403-762-4506', icon: 'medical' },
    { label: 'Poison control', value: '1-800-567-8911', icon: 'medical' },
    { label: 'Embassy', value: 'Contact your nearest consulate if abroad', icon: 'embassy' },
  ],
  Spain: [
    { label: 'Emergency', value: '112', icon: 'general' },
    { label: 'Police', value: '091', icon: 'police' },
    { label: 'Ambulance', value: '061', icon: 'medical' },
    { label: 'Embassy', value: 'Contact your home consulate in Barcelona', icon: 'embassy' },
  ],
  Greece: [
    { label: 'Emergency', value: '112', icon: 'general' },
    { label: 'Police', value: '100', icon: 'police' },
    { label: 'Ambulance', value: '166', icon: 'medical' },
    { label: 'Embassy', value: 'Contact your home embassy in Athens', icon: 'embassy' },
  ],
  'New Zealand': [
    { label: 'Emergency', value: '111', icon: 'general' },
    { label: 'Police non-emergency', value: '105', icon: 'police' },
    { label: 'Medical', value: '111', icon: 'medical' },
    { label: 'Embassy', value: 'Contact your home embassy in Wellington', icon: 'embassy' },
  ],
}

export function getEmergencyContacts(country: string): EmergencyContact[] {
  return BY_COUNTRY[country] ?? DEFAULT.map((contact) =>
    contact.label === 'Embassy / consulate'
      ? { ...contact, value: `Contact your home embassy in ${country}` }
      : contact,
  )
}
