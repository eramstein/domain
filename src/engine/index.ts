import { gameConfig } from '@data/index'
import { gameState } from '@state/gameState'

import { initializeGame } from './bootstrap/initializeGame'
import { getTimeString, passTurn } from './time'

/** Start or restart the game from static content. */
export function engineInitializeGame(): void {
  initializeGame()
}

/** Advance the simulation by one period. */
export function enginePassTurn(): void {
  passTurn(gameState)
}

/** Human-readable calendar date for the current simulation day. */
export function engineGetTimeString(): string {
  return getTimeString(gameState.time, gameConfig.startDate)
}

export { initializeGame } from './bootstrap/initializeGame'
