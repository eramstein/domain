import type { ActionDuration, GameState, ResolvedAction } from '@/types'

import { getPlaceById, getRegionForPlace } from '../places/lookups'
import { getActionDefinition } from './definitions'

export function getActionDuration(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): ActionDuration | undefined {
  const definition = getActionDefinition(resolved.actionId)
  if (!definition) return undefined

  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character) return undefined

  if (resolved.actionId === 'goto') {
    const placeId = resolved.parameters.placeId
    if (typeof placeId !== 'string') return undefined

    const targetPlace = getPlaceById(state, placeId)
    if (!targetPlace) return undefined

    const currentRegion = getRegionForPlace(state, character.placeId)
    if (!currentRegion) return undefined

    return currentRegion.id === targetPlace.regionId ? 'short' : 'long'
  }

  if (resolved.actionId === 'collect-resource') {
    return 'long'
  }

  return undefined
}
