import type { GameState, ResolvedAction } from '@/types'

import { getPlaceById } from '../../places/lookups'
import { getResourceById } from '../../resources/lookups'
import type { RequirementFailure } from './types'

function getCharacterMessagePrefix(
  state: GameState,
  characterId: string,
): string {
  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character) return 'You'
  return character.isPlayer ? 'You' : character.name
}

export function checkCollectResourceAtPlace(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): RequirementFailure | undefined {
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

  if (character.placeId === placeId) return undefined

  const subject = getCharacterMessagePrefix(state, characterId)
  const verb = subject === 'You' ? 'need' : 'needs'

  return {
    kind: 'at-place',
    placeId,
    resourceId,
    message: `${subject} ${verb} to be at the ${place.name} to collect ${resource.name.toLowerCase()} there.`,
  }
}

export function checkCollectResourcePresent(
  state: GameState,
  _characterId: string,
  resolved: ResolvedAction,
): RequirementFailure | undefined {
  const placeId = resolved.parameters.placeId
  const resourceId = resolved.parameters.resourceId
  if (typeof placeId !== 'string' || typeof resourceId !== 'string') {
    return undefined
  }

  const place = getPlaceById(state, placeId)
  const resource = getResourceById(state, resourceId)
  if (!place || !resource) return undefined

  const naturalResource = place.naturalResources.find(
    (entry) => entry.resourceId === resourceId,
  )
  if (naturalResource && naturalResource.abundance > 0) return undefined

  return {
    kind: 'resource-at-place',
    placeId,
    resourceId,
    message: `There is no ${resource.name.toLowerCase()} to collect at the ${place.name}.`,
  }
}
