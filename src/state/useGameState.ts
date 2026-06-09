import { readonly } from 'vue'

import { gameState } from './gameState'

/**
 * Read-only view of GameState for UI components.
 * Prevents accidental direct mutation from the presentation layer.
 */
export function useGameState() {
  return readonly(gameState)
}
