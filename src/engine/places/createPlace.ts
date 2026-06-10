import type { GameState, Place } from '@/types'

import { getPlaceById, getRegionById } from './lookups'

/** Add a new place at runtime. */
export function createPlace(state: GameState, place: Place): void {
  if (getPlaceById(state, place.id)) return
  if (!getRegionById(state, place.regionId)) return

  state.places.push(place)
}
