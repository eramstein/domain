import { applyGameState } from '@state/gameState'
import { databaseService } from '@/services/database/databaseService'

import { initializeGame } from '../bootstrap/initializeGame'

/** Load the most recent save, or seed from static content when none exist. */
export async function bootstrapGame(): Promise<void> {
  const latestSave = await databaseService.getLatestSave()

  if (latestSave) {
    applyGameState(latestSave.state)
    return
  }

  initializeGame()
}
