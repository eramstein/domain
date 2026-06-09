import type { GameState } from '@/types'

import { nextGameTime } from './periods'

/** Advance the simulation by one period. */
export function passTurn(state: GameState): void {
  state.time = nextGameTime(state.time)
}
