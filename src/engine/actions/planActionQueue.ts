import type { GameState, ResolvedAction } from '@/types'

import { actionsEqual } from './actionsEqual'
import { canExecuteAction } from './canExecuteAction'
import { getFirstRequirementFailure, getRemediablePrerequisite } from './requirements/registry'

const MAX_QUEUE_DEPTH = 8

/**
 * Build an ordered list of actions that lead to the goal, inserting prerequisite
 * actions (for example, travel before gathering) when requirements are unmet.
 */
export function planActionQueue(
  state: GameState,
  characterId: string,
  goal: ResolvedAction,
): ResolvedAction[] {
  const steps: ResolvedAction[] = [goal]

  for (let depth = 0; depth < MAX_QUEUE_DEPTH; depth++) {
    const head = steps[0]

    if (canExecuteAction(state, characterId, head)) {
      return steps
    }

    const failure = getFirstRequirementFailure(state, characterId, head)
    if (!failure) {
      return steps
    }

    const prereq = getRemediablePrerequisite(state, characterId, head)
    if (!prereq || steps.some((step) => actionsEqual(step, prereq))) {
      return steps
    }

    steps.unshift(prereq)
  }

  return steps
}
