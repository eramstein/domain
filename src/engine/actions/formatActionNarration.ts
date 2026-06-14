import type { ActionDuration, GameState, ResolvedAction } from '@/types'

import { getPlaceById } from '../places/lookups'
import { getResourceById } from '../resources/lookups'

export function formatActionNarration(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
  duration: ActionDuration,
): string | undefined {
  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character) return undefined

  if (resolved.actionId === 'goto') {
    const placeId = resolved.parameters.placeId
    if (typeof placeId !== 'string') return undefined

    const place = getPlaceById(state, placeId)
    if (!place) return undefined

    if (character.isPlayer) {
      return duration === 'long'
        ? `You travel to the ${place.name}.`
        : `You go to the ${place.name}.`
    }

    return duration === 'long'
      ? `${character.name} travelled to the ${place.name}.`
      : `${character.name} went to the ${place.name}.`
  }

  if (resolved.actionId === 'collect-resource') {
    const placeId = resolved.parameters.placeId
    const resourceId = resolved.parameters.resourceId
    if (typeof placeId !== 'string' || typeof resourceId !== 'string') {
      return undefined
    }

    const place = getPlaceById(state, placeId)
    const resource = getResourceById(state, resourceId)
    if (!place || !resource) return undefined

    if (character.isPlayer) {
      return `You collect ${resource.name.toLowerCase()} in the ${place.name}.`
    }

    return `${character.name} collected ${resource.name.toLowerCase()} in the ${place.name}.`
  }

  return undefined
}

export function formatNpcActionFailureNarration(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
  message?: string,
): string | undefined {
  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character || character.isPlayer) return undefined

  if (message) {
    if (message.startsWith('You ')) {
      return `${character.name} could not complete the order.`
    }
    return message
  }

  if (resolved.actionId === 'goto') {
    const placeId = resolved.parameters.placeId
    if (typeof placeId !== 'string') return undefined

    const place = getPlaceById(state, placeId)
    if (!place) return undefined

    return `${character.name} could not reach the ${place.name}.`
  }

  if (resolved.actionId === 'collect-resource') {
    const placeId = resolved.parameters.placeId
    const resourceId = resolved.parameters.resourceId
    if (typeof placeId !== 'string' || typeof resourceId !== 'string') {
      return undefined
    }

    const place = getPlaceById(state, placeId)
    const resource = getResourceById(state, resourceId)
    if (!place || !resource) return undefined

    return `${character.name} could not collect ${resource.name.toLowerCase()} at the ${place.name}.`
  }

  return `${character.name} could not complete the order.`
}
