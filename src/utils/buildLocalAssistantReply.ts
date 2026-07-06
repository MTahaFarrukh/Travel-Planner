import type { Destination } from '../types/destination'
import { getEmergencyContacts } from '../pdf/emergencyContacts'

type Topic = 'food' | 'transit' | 'rideshare' | 'customs' | 'emergency' | 'scams' | 'currency' | 'general'

const DESTINATION_TIPS: Record<
  string,
  Record<Topic, string[]>
> = {
  kyoto: {
    food: [
      'Nishiki Market for street snacks and local specialties',
      'Pontocho alley for kaiseki and izakaya in the evening',
      'Try matcha desserts in Gion — arrive before 11:30 for lunch spots',
    ],
    transit: [
      'IC card (Suica/PASMO) works on buses and subways — load at station machines',
      'Kyoto city bus day pass (~700 yen) if you ride 3+ bus trips',
      'Subway is limited — buses cover most sights efficiently',
    ],
    rideshare: [
      'Uber operates in Kyoto but coverage can be sparse',
      'Taxis are reliable; look for green license plates',
      'Late night: taxi stands near Kyoto Station are easiest',
    ],
    customs: [
      'Remove shoes when entering tatami rooms and some restaurants',
      'Speak quietly on buses and in temples',
      'Bow lightly when greeting shop staff',
    ],
    emergency: [],
    scams: [
      'Avoid “geisha photo” touts in Gion who demand high fees after photos',
      'Decline overpriced rickshaw quotes without agreeing a price first',
      'Use official temple ticket booths, not unofficial “skip the line” offers',
    ],
    currency: [
      'Japan is still cash-heavy — withdraw yen at 7-Eleven ATMs (7 Bank)',
      'Exchange at banks or post offices for better rates than airport kiosks',
      'Many small eateries do not accept foreign cards',
    ],
    general: [],
  },
  bali: {
    food: [
      'Warungs for affordable nasi campur and satay',
      'Ubud organic cafes for smoothie bowls and Balinese coffee',
      'Seafood grills in Jimbaran — confirm price per kilo before ordering',
    ],
    transit: [
      'No metro — use Gojek/Grab for scooters and cars',
      'Rent a scooter only if experienced; traffic is dense',
      'Private drivers for day trips are often better value than taxis',
    ],
    rideshare: [
      'Grab and Gojek are widely available and cheaper than street taxis',
      'Agree on ride price in app before confirming',
      'Airport taxis use a prepaid coupon system — use official desk',
    ],
    customs: [
      'Wear a sarong and sash at temples (often available to rent)',
      'Do not step on daily offerings (canang sari) on sidewalks',
      'Use right hand when giving or receiving items',
    ],
    emergency: [],
    scams: [
      'Money-changing stalls with “no commission” signs may use rigged calculators',
      'Be wary of unsolicited tour offers at beaches',
      'Confirm scooter rental damage before paying deposits',
    ],
    currency: [
      'Withdraw IDR at reputable ATMs inside banks when possible',
      'Carry smaller notes for temples and markets',
      'Avoid beachside money changers with rates that seem too good',
    ],
    general: [],
  },
  barcelona: {
    food: [
      'La Boqueria for tapas ingredients; eat at counter bars nearby',
      'Gràcia neighborhood for local restaurants away from Ramblas crowds',
      'Book paella at lunch — dinner paella is often tourist-targeted',
    ],
    transit: [
      'T-Casual (10 journeys) or Hola BCN unlimited pass for tourists',
      'Metro covers most sights; validate tickets before boarding',
      'Aeroport T1/T2: R2 Nord train or Aerobús depending on hotel area',
    ],
    rideshare: [
      'Uber and Cabify operate; taxis are official yellow/black',
      'Use licensed taxi ranks — avoid unmarked cars at Ramblas',
      'Bolt is another common option for airport transfers',
    ],
    customs: [
      'Catalan and Spanish both used — “Bon dia” is appreciated',
      'Dinner starts late (after 9 pm) at many restaurants',
      'Keep voices down on residential streets at night',
    ],
    emergency: [],
    scams: [
      'Pickpockets on Las Ramblas, metro L3, and Sagrada Família queues',
      '“Friendship bracelet” and petition signature scams',
      'Restaurants on La Rambla with photo menus — check bill carefully',
    ],
    currency: [
      'Eurozone — cards widely accepted; carry coins for small bakeries',
      'Use bank ATMs (CaixaBank, Santander) to avoid Euronet fees',
      'Airport exchange rates are poor — withdraw euros in city if needed',
    ],
    general: [],
  },
  banff: {
    food: [
      'Park lodges for hearty Canadian fare after hikes',
      'Banff Ave breweries and bistros — reserve summer evenings',
      'Pack trail snacks — options thin on remote trailheads',
    ],
    transit: [
      'Roam Transit bus pass for Banff–Canmore local routes',
      'Parks Canada shuttles to Lake Louise and Moraine Lake in peak season',
      'Rent a car for flexibility to trailheads',
    ],
    rideshare: [
      'Uber is limited in Banff townsite',
      'Taxi companies serve Banff and Canmore — book ahead in winter storms',
      'Many hotels offer ski shuttles in winter',
    ],
    customs: [
      'Give wildlife 30+ metres space — never feed animals',
      'Stay on marked trails to protect alpine vegetation',
      'Quiet hours matter in national park lodging',
    ],
    emergency: [],
    scams: [
      'Fake parking passes — buy only from official Parks Canada or town meters',
      'Unlicensed wildlife tour operators — verify Parks Canada partners',
    ],
    currency: [
      'Canadian dollars at bank ATMs in Banff',
      'Cards accepted almost everywhere; carry cash for small tips',
      'US dollars sometimes accepted at poor rates — use CAD',
    ],
    general: [],
  },
  queenstown: {
    food: [
      'Fergburger for iconic burgers (expect a queue)',
      'Arrowtown cafes for a quieter lunch day trip',
      'Winery restaurants in Gibbston Valley — book ahead',
    ],
    transit: [
      'Orbus Queenstown for local buses; day pass available',
      'Most adventure activities include hotel pickup',
      'Rental car useful for Glenorchy and Milford day trips',
    ],
    rideshare: [
      'Uber operates in Queenstown with variable wait times',
      'Taxis at airport and central taxi rank on Camp Street',
      'Pre-book airport transfers in winter peak season',
    ],
    customs: [
      'Kiwis value punctuality for tours and bungee slots',
      'Remove outdoor shoes in many holiday homes and some lodges',
      'Tipping is appreciated but not obligatory (~10% at restaurants)',
    ],
    emergency: [],
    scams: [
      'Verify adventure operator safety certifications before booking',
      'Secondary sellers for skydiving/jet boats — book direct when possible',
    ],
    currency: [
      'NZD from ANZ or Westpac ATMs in town',
      'Cards common; some rural stops are cash-only',
      'Airport FX kiosks charge high spreads',
    ],
    general: [],
  },
  santorini: {
    food: [
      'Ammoudi Bay tavernas for seafood at sunset',
      'Fira backstreets for better-value gyros than caldera-front spots',
      'Try Assyrtiko wine at a caldera winery with reservation',
    ],
    transit: [
      'KTEL buses connect Fira, Oia, and airport — buy ticket on board',
      'No metro — ATVs popular but drive cautiously on cliff roads',
      'Fira–Oia hiking trail is free and scenic (bring water)',
    ],
    rideshare: [
      'Uber is not reliable in Santorini',
      'Use pre-booked transfers or official taxi rank in Fira',
      'Hotel port/airport pickups are often simplest with luggage',
    ],
    customs: [
      'Dress modestly in churches and monasteries',
      'Sunset crowds in Oia are intense — arrive early and be patient',
      'Greeks appreciate a friendly “Kalimera” in the morning',
    ],
    emergency: [],
    scams: [
      'Donkey ride operators may overcharge — agree price first',
      'Restaurant service charges on bill — check before tipping again',
      'ATV rental damage disputes — photograph vehicle before leaving',
    ],
    currency: [
      'Euros — cards accepted in towns; carry cash for small villages',
      'Bank ATMs in Fira preferable to standalone street machines',
      'Some cliff restaurants prefer card for larger bills',
    ],
    general: [],
  },
}

function detectTopic(question: string): Topic {
  const q = question.toLowerCase()
  if (/eat|food|restaurant|dining|café|cafe/.test(q)) return 'food'
  if (/metro|transit|pass|bus|train|transport/.test(q)) return 'transit'
  if (/uber|lyft|grab|taxi|rideshare|bolt|cabify/.test(q)) return 'rideshare'
  if (/custom|culture|etiquette|manners|local/.test(q)) return 'customs'
  if (/emergency|police|ambulance|hospital|911|112|110|119/.test(q)) return 'emergency'
  if (/scam|fraud|pickpocket|trap/.test(q)) return 'scams'
  if (/currency|money|exchange|atm|cash|card/.test(q)) return 'currency'
  return 'general'
}

function topicHeading(topic: Topic): string {
  const headings: Record<Topic, string> = {
    food: 'Where to eat',
    transit: 'Transit & passes',
    rideshare: 'Rideshare & taxis',
    customs: 'Local customs',
    emergency: 'Emergency numbers',
    scams: 'Scam warnings',
    currency: 'Currency exchange',
    general: 'Travel advice',
  }
  return headings[topic]
}

export function buildLocalAssistantReply(
  destination: Destination,
  question: string,
): string {
  const topic = detectTopic(question)
  const tips =
    DESTINATION_TIPS[destination.id]?.[topic] ??
    DESTINATION_TIPS.kyoto[topic]

  const lines: string[] = [
    `## ${topicHeading(topic)} in ${destination.name}`,
    '',
    `Here are practical tips for **${destination.name}, ${destination.country}**:`,
    '',
  ]

  if (topic === 'emergency') {
    const contacts = getEmergencyContacts(destination.country)
    for (const contact of contacts) {
      lines.push(`- **${contact.label}:** ${contact.value}`)
    }
  } else {
    for (const tip of tips) {
      lines.push(`- ${tip}`)
    }
  }

  if (topic === 'general') {
    lines.push(
      `- Explore ${destination.tagline}`,
      '- Ask your hotel concierge to confirm hours and seasonal closures',
      '- Save offline maps before heading to low-signal areas',
    )
  }

  lines.push(
    '',
    '**Note:** Local rules change — double-check transport apps and restaurant hours on arrival.',
  )

  return lines.join('\n')
}
