import { reactive } from 'vue'

import type { GameState } from '@/types'
import { INITIAL_GAME_TIME } from '@/types/time'

function createEmptyGameState(): GameState {
  return {
    time: { ...INITIAL_GAME_TIME },
    characters: [],
    places: [],
    resources: [],
    narration: [],
  }
}

/**
 * Reactive singleton holding all runtime simulation data.
 * Only Engine modules may mutate this object.
 */
export const gameState = reactive<GameState>(createEmptyGameState())

export function resetGameState(): void {
  const empty = createEmptyGameState()
  gameState.time = empty.time
  gameState.characters = empty.characters
  gameState.places = empty.places
  gameState.resources = empty.resources
  gameState.narration = empty.narration
}
