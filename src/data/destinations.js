/** @typedef {'beach' | 'city' | 'mountain' | 'cultural' | 'adventure'} DestinationCategory */

/**
 * @typedef {Object} Destination
 * @property {string} id
 * @property {string} name
 * @property {string} country
 * @property {DestinationCategory} category
 * @property {string} tagline
 * @property {string} imageUrl
 * @property {number} lat
 * @property {number} lon
 */

/** Optimized Unsplash CDN URLs — w=640, q=75, auto=format for fast loads */
/** @type {Destination[]} */
export const destinations = [
  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    category: 'beach',
    tagline: 'Terraced rice fields meet turquoise shores.',
    imageUrl:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=640&h=400&fit=crop&q=75&auto=format',
    lat: -8.4095,
    lon: 115.1889,
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    category: 'cultural',
    tagline: 'Temples, tea houses, and timeless gardens.',
    imageUrl:
      'https://images.unsplash.com/photo-1493976040374-be403c5ee0b7?w=640&h=400&fit=crop&q=75&auto=format',
    lat: 35.0116,
    lon: 135.7681,
  },
  {
    id: 'banff',
    name: 'Banff',
    country: 'Canada',
    category: 'mountain',
    tagline: 'Glacial lakes framed by the Canadian Rockies.',
    imageUrl:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=400&fit=crop&q=75&auto=format',
    lat: 51.1784,
    lon: -115.5708,
  },
  {
    id: 'barcelona',
    name: 'Barcelona',
    country: 'Spain',
    category: 'city',
    tagline: 'Gaudí architecture and Mediterranean nights.',
    imageUrl:
      'https://images.unsplash.com/photo-1583422409516-0898d1853856?w=640&h=400&fit=crop&q=75&auto=format',
    lat: 41.3874,
    lon: 2.1686,
  },
  {
    id: 'queenstown',
    name: 'Queenstown',
    country: 'New Zealand',
    category: 'adventure',
    tagline: 'Bungee jumps, fjords, and alpine thrills.',
    imageUrl:
      'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=640&h=400&fit=crop&q=75&auto=format',
    lat: -45.0312,
    lon: 168.6626,
  },
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    category: 'beach',
    tagline: 'Whitewashed cliffs above the Aegean.',
    imageUrl:
      'https://images.unsplash.com/photo-1613395877348-76b7a0e6a0ef?w=640&h=400&fit=crop&q=75&auto=format',
    lat: 36.3932,
    lon: 25.4615,
  },
]

export const destinationCategories = [
  'beach',
  'city',
  'mountain',
  'cultural',
  'adventure',
]
