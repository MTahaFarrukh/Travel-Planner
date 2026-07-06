export interface Hotel {
  id: string
  destinationId: string
  name: string
  pricePerNight: number
  rating: number
  amenities: string[]
  imageUrl: string
}

export interface BookingDateRange {
  checkIn: string
  checkOut: string
}

export interface Reservation {
  id: string
  hotelId: string
  hotelName: string
  destinationId: string
  destinationName: string
  pricePerNight: number
  checkIn: string
  checkOut: string
  bookedAt: string
}
