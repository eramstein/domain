import type { GameState } from '@/types'

import { actionsEqual } from '../actions/actionsEqual'
import { canExecuteAction } from '../actions/canExecuteAction'
import { executeAction } from '../actions/executeAction'
import { formatNpcActionFailureNarration } from '../actions/formatActionNarration'
import { getFirstRequirementFailure } from '../actions/requirements/registry'
import { planActionQueue } from '../actions/planActionQueue'
import { appendNarration } from '../narration/appendNarration'
import { getAllies } from './lookups'
import { getDefaultNpcAction } from './orders'

function isOrderBlocked(
  state: GameState,
  characterId: string,
  queue: readonly { actionId: string; parameters: Record<string, string | number | boolean> }[],
): boolean {
  const next = queue[0]
  if (!next) return false

  if (canExecuteAction(state, characterId, next)) return false

  const failure = getFirstRequirementFailure(state, characterId, next)
  return failure !== undefined && failure.kind === 'resource-at-place'
}

/** Execute ally orders or default actions when the player ends the turn. */
export function executeNpcTurns(state: GameState): void {
  for (const ally of getAllies(state)) {
    const goal = ally.order ?? getDefaultNpcAction(state, ally.id)
    if (!goal) {
      ally.actionQueue = []
      continue
    }

    const queue = planActionQueue(state, ally.id, goal)

    let goalCompleted = false

    while (queue.length > 0) {
      const next = queue[0]
      if (!canExecuteAction(state, ally.id, next)) break

      const result = executeAction(state, ally.id, next)
      if (!result.success) {
        const narration = formatNpcActionFailureNarration(
          state,
          ally.id,
          next,
          result.message,
        )
        if (narration) {
          appendNarration(state, narration)
        }
        break
      }

      queue.shift()
      if (actionsEqual(next, goal)) {
        goalCompleted = true
      }
    }

    if (ally.order) {
      if (goalCompleted) {
        ally.order = null
        ally.actionQueue = []
      } else if (isOrderBlocked(state, ally.id, queue)) {
        const blocked = queue[0]
        const narration = formatNpcActionFailureNarration(
          state,
          ally.id,
          blocked,
          getFirstRequirementFailure(state, ally.id, blocked)?.message,
        )
        if (narration) {
          appendNarration(state, narration)
        }
        ally.order = null
        ally.actionQueue = []
      } else {
        ally.actionQueue = queue
      }
    } else {
      ally.actionQueue = []
    }
  }
}
