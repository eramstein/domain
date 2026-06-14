import type { GameState, ResolvedAction } from '@/types'

import { planActionQueue } from '../actions/planActionQueue'
import { isValidResolvedAction } from '../actions/validateAction'
import { getPlaceById } from '../places/lookups'
import { getCharacterById } from './lookups'

export function setNpcOrder(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): { success: boolean; message?: string } {
  const character = getCharacterById(state, characterId)
  if (!character || character.isPlayer || character.npcType !== 'ally') {
    return { success: false, message: 'You can only give orders to allies.' }
  }

  if (!isValidResolvedAction(state, resolved)) {
    return { success: false, message: "That order isn't valid." }
  }

  character.order = resolved
  character.actionQueue = planActionQueue(state, characterId, resolved)
  return { success: true }
}

export function clearNpcOrder(
  state: GameState,
  characterId: string,
): { success: boolean; message?: string } {
  const character = getCharacterById(state, characterId)
  if (!character || character.isPlayer || character.npcType !== 'ally') {
    return { success: false, message: 'You can only cancel orders for allies.' }
  }

  character.order = null
  character.actionQueue = []
  return { success: true }
}

export function getDefaultNpcAction(
  state: GameState,
  characterId: string,
): ResolvedAction | null {
  const character = getCharacterById(state, characterId)
  if (!character) return null

  const place = getPlaceById(state, character.placeId)
  if (!place) return null

  const naturalResource = place.naturalResources.find(
    (entry) => entry.abundance > 0,
  )
  if (!naturalResource) return null

  return {
    actionId: 'collect-resource',
    parameters: {
      placeId: place.id,
      resourceId: naturalResource.resourceId,
    },
  }
}
