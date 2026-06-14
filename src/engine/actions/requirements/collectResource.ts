import type { GameState, ResolvedAction } from '@/types'

import { getPlaceById } from '../../places/lookups'
import { getResourceById } from '../../resources/lookups'

export function checkCollectResourceRequirements(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): string | undefined {
  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character) return undefined

  const placeId = resolved.parameters.placeId
  const resourceId = resolved.parameters.resourceId
  if (typeof placeId !== 'string' || typeof resourceId !== 'string') {
    return undefined
  }

  const place = getPlaceById(state, placeId)
  const resource = getResourceById(state, resourceId)
  if (!place || !resource) return undefined

  if (character.placeId !== placeId) {
    if (character.isPlayer) {
      return `You need to be at the ${place.name} to collect ${resource.name.toLowerCase()} there.`
    }
    return `${character.name} needs to be at the ${place.name} to collect ${resource.name.toLowerCase()} there.`
  }

  const naturalResource = place.naturalResources.find(
    (entry) => entry.resourceId === resourceId,
  )
  if (!naturalResource || naturalResource.abundance <= 0) {
    if (character.isPlayer) {
      return `There is no ${resource.name.toLowerCase()} to collect at the ${place.name}.`
    }
    return `There is no ${resource.name.toLowerCase()} to collect at the ${place.name}.`
  }

  return undefined
}
