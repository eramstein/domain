import type { GameState } from '@/types'

import { goTo } from '../places/goTo'

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

  return false
}
