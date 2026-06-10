import type { GameState } from '@/types'

export function resetTurnBudgets(state: GameState): void {
  for (const character of state.characters) {
    character.turnBudget.longActionUsed = false
  }
}
