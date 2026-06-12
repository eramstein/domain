import { gameState } from '@state/gameState'
import { databaseService } from '@/services/database/databaseService'

import { snapshotGameState } from './snapshotGameState'

/** Persist the current simulation state under a named save slot. */
export async function saveGame(name: string): Promise<void> {
  await databaseService.saveGame(name, snapshotGameState(gameState))
}
