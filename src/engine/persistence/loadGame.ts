import { applyGameState } from '@state/gameState'
import { databaseService } from '@/services/database/databaseService'

/** Restore simulation state from a named save slot. Returns false when missing. */
export async function loadGame(name: string): Promise<boolean> {
  const state = await databaseService.loadGame(name)

  if (!state) {
    return false
  }

  applyGameState(state)
  return true
}
