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
  applyGameState(createEmptyGameState())
}

/** Replace runtime simulation data (used by Engine when loading saves). */
export function applyGameState(source: GameState): void {
  const next = structuredClone(source)
  gameState.time = next.time
  gameState.regions = next.regions
  gameState.places = next.places
  for (const character of next.characters) {
    if (!character.actionQueue) {
      character.actionQueue = []
    }
  }
  gameState.characters = next.characters
  gameState.resources = next.resources
  gameState.narration = next.narration
}
