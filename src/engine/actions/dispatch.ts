import type { GameState } from '@/types'

import { goTo } from '../places/goTo'
import { collectResource } from '../resources/collectResource'

export function dispatchAction(
  state: GameState,
  characterId: string,
  handler: string,
  parameters: Record<string, string | number | boolean>,
): boolean {
  if (handler === 'places.goTo') {
    const placeId = parameters.placeId
    if (typeof placeId !== 'string') return false

    goTo(state, characterId, placeId)
    return true
  }

  if (handler === 'resources.collect') {
    const placeId = parameters.placeId
    const resourceId = parameters.resourceId
    if (typeof placeId !== 'string' || typeof resourceId !== 'string') {
      return false
    }

    return collectResource(state, placeId, resourceId)
  }

  return false
}
