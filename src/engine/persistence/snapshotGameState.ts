import { toRaw } from 'vue'

import type { GameState } from '@/types'

/** Plain, serializable copy of simulation state (strips Vue reactivity). */
export function snapshotGameState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(toRaw(state))) as GameState
}
