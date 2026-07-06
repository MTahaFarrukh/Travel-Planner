import type { Hotel } from '../types/hotel'

export declare const hotelsByDestination: Record<string, Hotel[]>
export declare function getHotelsForDestination(
  destinationId: string,
): Hotel[]
