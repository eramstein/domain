import { reactive } from 'vue'

import type { GameState } from '@/types'
import { INITIAL_GAME_TIME } from '@/types/time'

function createEmptyGameState(): GameState {
  return {
    time: { ...INITIAL_GAME_TIME },
    regions: [],
    places: [],
    characters: [],
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
  gameState.regions = empty.regions
  gameState.places = empty.places
  gameState.characters = empty.characters
  gameState.resources = empty.resources
  gameState.narration = empty.narration
}
