import type { MapPlace } from '../types/map'

const CATEGORY_TIPS: Record<string, string[]> = {
  beach: [
    'Pack reef-safe sunscreen and stay hydrated during midday sun.',
    'Check tide times before coastal walks or swims.',
    'Keep valuables in a dry bag when at the beach.',
  ],
  cultural: [
    'Research temple or shrine etiquette before visiting sacred sites.',
    'Remove shoes where required and speak softly indoors.',
    'Visit popular sites early morning for fewer crowds.',
  ],
  mountain: [
    'Layer clothing — temperatures shift quickly at altitude.',
    'Carry water and tell someone your trail plan.',
    'Check park alerts and wildlife guidance before hiking.',
  ],
  city: [
    'Use public transit passes to save on daily transport.',
    'Book major attractions online to skip queues.',
    'Keep a photocopy of your passport separate from the original.',
  ],
  adventure: [
    'Confirm activity operators are licensed and insured.',
    'Wear appropriate footwear and check weather before outdoor plans.',
    'Build buffer time between high-adrenaline activities.',
  ],
}

const UNIVERSAL_TIPS = [
  'Download offline maps and save confirmation emails before departure.',
  'Notify your bank of travel dates to avoid card blocks abroad.',
  'Photograph your passport and store a copy in secure cloud storage.',
  'Keep a small amount of local currency for transit and tips on arrival.',
  'Share your itinerary with a trusted contact at home.',
]

export function buildTravelTips(
  category: string,
  aiPlaces: MapPlace[],
): string[] {
  const tips = [
    ...(CATEGORY_TIPS[category] ?? CATEGORY_TIPS.city),
    ...UNIVERSAL_TIPS,
  ]

  for (const place of aiPlaces.slice(0, 3)) {
    if (place.description) {
      tips.push(`Don't miss ${place.name}: ${place.description}`)
    }
  }

  return [...new Set(tips)].slice(0, 10)
}
