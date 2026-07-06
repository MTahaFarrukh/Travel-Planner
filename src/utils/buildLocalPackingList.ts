import {
  MONTH_OPTIONS,
  TRIP_TYPE_OPTIONS,
  WEATHER_OPTIONS,
} from '../constants/packing'
import type {
  PackingActivity,
  PackingChecklist,
  PackingListByCategory,
  PackingRequest,
  PackingTripType,
  PackingWeather,
} from '../types/packing'
import { itemsFromCategoryLists } from './parsePackingResponse'

function labelFor<T extends string>(
  options: { id: T; label: string }[],
  id: T | null,
): string {
  if (!id) return ''
  return options.find((option) => option.id === id)?.label ?? id
}

function unique(items: string[]): string[] {
  return [...new Set(items.map((item) => item.trim()).filter(Boolean))]
}

function clothingForWeather(weather: PackingWeather | null): string[] {
  switch (weather) {
    case 'cold':
      return [
        'Thermal base layers',
        'Insulated jacket',
        'Warm hat and gloves',
        'Wool socks',
      ]
    case 'hot':
      return [
        'Breathable linen shirts',
        'Light shorts or skirts',
        'Sun hat',
        'Sandals',
      ]
    case 'rainy':
      return [
        'Waterproof rain jacket',
        'Quick-dry trousers',
        'Compact umbrella',
        'Water-resistant shoes',
      ]
    case 'sunny':
      return [
        'Light cotton tops',
        'Comfortable walking shoes',
        'Sunglasses',
        'Sun-protective clothing',
      ]
    default:
      return [
        'Layered outfits',
        'Light sweater or cardigan',
        'Comfortable walking shoes',
        'Versatile day-to-night outfit',
      ]
  }
}

function extrasForTripType(tripType: PackingTripType | null): string[] {
  switch (tripType) {
    case 'business':
      return ['Blazer or formal top', 'Dress shoes', 'Business cards', 'Laptop sleeve']
    case 'adventure':
      return ['Daypack', 'Reusable water bottle', 'Headlamp', 'Dry bag']
    case 'backpacking':
      return ['Packable daypack', 'Travel towel', 'Laundry bag', 'Combination lock']
    case 'family':
      return ['Snacks for transit', 'Entertainment for kids', 'Wet wipes', 'Spare outfit for children']
    default:
      return ['Day bag', 'Reusable water bottle', 'Travel pillow', 'Laundry bag']
  }
}

function extrasForActivities(activities: PackingActivity[]): string[] {
  const items: string[] = []

  if (activities.includes('hiking')) {
    items.push('Trail shoes', 'Hiking socks', 'Trekking poles')
  }
  if (activities.includes('beach')) {
    items.push('Swimwear', 'Beach towel', 'Reef-safe sunscreen', 'Flip-flops')
  }
  if (activities.includes('dining')) {
    items.push('Smart-casual outfit', 'Light scarf or accessory')
  }
  if (activities.includes('nightlife')) {
    items.push('Evening outfit', 'Small crossbody bag')
  }
  if (activities.includes('sightseeing')) {
    items.push('Comfortable day shoes', 'Guidebook or offline maps')
  }
  if (activities.includes('skiing')) {
    items.push('Thermal layers', 'Ski gloves', 'Neck gaiter', 'Lip balm with SPF')
  }
  if (activities.includes('photography')) {
    items.push('Camera or phone gimbal', 'Extra memory cards', 'Lens cloth')
  }

  return items
}

export function buildLocalPackingList(request: PackingRequest): PackingChecklist {
  const destination = request.destination.trim()
  const month = labelFor(MONTH_OPTIONS, request.travelMonth)
  const weather = labelFor(WEATHER_OPTIONS, request.weather)
  const tripType = labelFor(TRIP_TYPE_OPTIONS, request.tripType)

  const lists: PackingListByCategory = {
    documents: unique([
      'Passport (6+ months validity)',
      'Printed hotel confirmations',
      'Travel insurance documents',
      'Photo ID / driver licence',
      request.tripType === 'business' ? 'Meeting itinerary' : 'Flight and transfer tickets',
    ]),
    clothing: unique([
      ...clothingForWeather(request.weather),
      `Outfits suited for ${month} in ${destination}`,
      'Underwear and sleepwear',
      'Light scarf or wrap',
    ]),
    electronics: unique([
      'Phone and charger',
      'Universal power adapter',
      'Power bank',
      'Noise-cancelling headphones',
      request.activities.includes('photography') ? 'Camera charger' : 'E-reader or tablet',
    ]),
    medicine: unique([
      'Personal prescription medications',
      'Pain relievers',
      'Motion sickness tablets',
      'Adhesive bandages',
      request.weather === 'sunny' || request.weather === 'hot'
        ? 'After-sun gel'
        : 'Hand sanitiser',
      'Insect repellent',
    ]),
    accessories: unique([
      ...extrasForTripType(request.tripType),
      ...extrasForActivities(request.activities),
      request.weather === 'rainy' ? 'Waterproof phone pouch' : 'Sunglasses case',
      'Packing cubes',
    ]),
    essentials: unique([
      'Toiletry kit',
      'Sunscreen SPF 30+',
      `Weather-appropriate gear for ${weather} conditions`,
      'Reusable shopping tote',
      'Snacks for travel days',
      tripType ? `Items for a ${tripType.toLowerCase()} trip` : 'Travel-sized detergent',
      'Reusable water bottle',
    ]),
  }

  return itemsFromCategoryLists(lists, 'local')
}
