/** @typedef {import('../types/hotel').Hotel} Hotel */

/** @type {Record<string, Hotel[]>} */
export const hotelsByDestination = {
  bali: [
    {
      id: 'bali-umi',
      destinationId: 'bali',
      name: 'Umi Cliff Resort',
      pricePerNight: 185,
      rating: 4.8,
      amenities: ['Infinity pool', 'Spa', 'Ocean view', 'Breakfast'],
      imageUrl:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&h=400&fit=crop&q=75&auto=format',
    },
    {
      id: 'bali-jungle',
      destinationId: 'bali',
      name: 'Jungle Canopy Lodge',
      pricePerNight: 120,
      rating: 4.5,
      amenities: ['Garden', 'Yoga deck', 'Free Wi-Fi'],
      imageUrl:
        'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=640&h=400&fit=crop&q=75&auto=format',
    },
    {
      id: 'bali-seminyak',
      destinationId: 'bali',
      name: 'Seminyak Beach House',
      pricePerNight: 210,
      rating: 4.6,
      amenities: ['Beach access', 'Rooftop bar', 'Airport shuttle'],
      imageUrl:
        'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=640&h=400&fit=crop&q=75&auto=format',
    },
  ],
  kyoto: [
    {
      id: 'kyoto-ryokan',
      destinationId: 'kyoto',
      name: 'Gion Heritage Ryokan',
      pricePerNight: 240,
      rating: 4.9,
      amenities: ['Onsen', 'Kaiseki dinner', 'Garden', 'Kimono rental'],
      imageUrl:
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=640&h=400&fit=crop&q=75&auto=format',
    },
    {
      id: 'kyoto-boutique',
      destinationId: 'kyoto',
      name: 'Higashiyama Boutique Hotel',
      pricePerNight: 165,
      rating: 4.4,
      amenities: ['Tea lounge', 'Bicycle rental', 'Concierge'],
      imageUrl:
        'https://images.unsplash.com/photo-1528164344705-47542687000d?w=640&h=400&fit=crop&q=75&auto=format',
    },
  ],
  banff: [
    {
      id: 'banff-lake',
      destinationId: 'banff',
      name: 'Lake Louise Alpine Inn',
      pricePerNight: 295,
      rating: 4.7,
      amenities: ['Mountain view', 'Fireplace lounge', 'Ski storage'],
      imageUrl:
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=640&h=400&fit=crop&q=75&auto=format',
    },
    {
      id: 'banff-springs',
      destinationId: 'banff',
      name: 'Pine Ridge Lodge',
      pricePerNight: 175,
      rating: 4.3,
      amenities: ['Hot tub', 'Hiking maps', 'Pet friendly'],
      imageUrl:
        'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=640&h=400&fit=crop&q=75&auto=format',
    },
  ],
  barcelona: [
    {
      id: 'bcn-gothic',
      destinationId: 'barcelona',
      name: 'Gothic Quarter Hotel',
      pricePerNight: 195,
      rating: 4.5,
      amenities: ['Rooftop terrace', 'Tapas bar', 'City tours'],
      imageUrl:
        'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=640&h=400&fit=crop&q=75&auto=format',
    },
    {
      id: 'bcn-beach',
      destinationId: 'barcelona',
      name: 'Barceloneta Seaside Suites',
      pricePerNight: 230,
      rating: 4.6,
      amenities: ['Beachfront', 'Pool', 'Bike rental'],
      imageUrl:
        'https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=640&h=400&fit=crop&q=75&auto=format',
    },
  ],
  queenstown: [
    {
      id: 'qt-lakefront',
      destinationId: 'queenstown',
      name: 'Lakefront Adventure Lodge',
      pricePerNight: 220,
      rating: 4.7,
      amenities: ['Lake view', 'Gear rental', 'Breakfast'],
      imageUrl:
        'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=640&h=400&fit=crop&q=75&auto=format',
    },
    {
      id: 'qt-alpine',
      destinationId: 'queenstown',
      name: 'Alpine Base Camp',
      pricePerNight: 145,
      rating: 4.2,
      amenities: ['Ski shuttle', 'Sauna', 'Common kitchen'],
      imageUrl:
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=640&h=400&fit=crop&q=75&auto=format',
    },
  ],
  santorini: [
    {
      id: 'sant-caldera',
      destinationId: 'santorini',
      name: 'Caldera View Villas',
      pricePerNight: 320,
      rating: 4.9,
      amenities: ['Private terrace', 'Plunge pool', 'Sunset deck'],
      imageUrl:
        'https://images.unsplash.com/photo-1613395877194-086d0f7ac63a?w=640&h=400&fit=crop&q=75&auto=format',
    },
    {
      id: 'sant-cave',
      destinationId: 'santorini',
      name: 'Oia Cave Suites',
      pricePerNight: 275,
      rating: 4.7,
      amenities: ['Cave rooms', 'Wine cellar', 'Concierge'],
      imageUrl:
        'https://images.unsplash.com/photo-1570077188670-e3a8d69aa5ff?w=640&h=400&fit=crop&q=75&auto=format',
    },
  ],
}

/** @param {string} destinationId */
export function getHotelsForDestination(destinationId) {
  return hotelsByDestination[destinationId] ?? []
}
