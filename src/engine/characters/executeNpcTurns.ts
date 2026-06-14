import type { GameState } from '@/types'

import { executeAction } from '../actions/executeAction'
import { formatNpcActionFailureNarration } from '../actions/formatActionNarration'
import { appendNarration } from '../narration/appendNarration'
import { getAllies } from './lookups'
import { getDefaultNpcAction } from './orders'

/** Execute ally orders or default actions when the player ends the turn. */
export function executeNpcTurns(state: GameState): void {
  for (const ally of getAllies(state)) {
    const resolved = ally.order ?? getDefaultNpcAction(state, ally.id)
    ally.order = null

    if (!resolved) continue

    const result = executeAction(state, ally.id, resolved)
    if (!result.success) {
      const narration = formatNpcActionFailureNarration(
        state,
        ally.id,
        resolved,
        result.message,
      )
      if (narration) {
        appendNarration(state, narration)
      }
    }
  }
}
