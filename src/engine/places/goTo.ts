import type { GameState } from '@/types'

import { getPlaceById } from './lookups'

/** Move a character to a new place. */
export function goTo(
  state: GameState,
  characterId: string,
  placeId: string,
): void {
  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character) return

  const place = getPlaceById(state, placeId)
  if (!place) return

  character.placeId = placeId
}
