import type { Attraction } from '../types/attraction'

export declare const attractions: Attraction[]
export declare function getAttractionsForDestination(
  destinationId: string,
): Attraction[]
