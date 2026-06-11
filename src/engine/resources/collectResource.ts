import type { GameState } from '@/types'

import { getPlaceById } from '../places/lookups'
import { addResourceStock } from './stock'

export function collectResource(
  state: GameState,
  placeId: string,
  resourceId: string,
): boolean {
  const place = getPlaceById(state, placeId)
  if (!place) return false

  const naturalResource = place.naturalResources.find(
    (entry) => entry.resourceId === resourceId,
  )
  if (!naturalResource || naturalResource.abundance <= 0) return false

  addResourceStock(state, resourceId, naturalResource.abundance)
  return true
}
