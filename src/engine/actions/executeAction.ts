import type { GameState, ResolvedAction } from '@/types'

import { appendNarration } from '../narration/appendNarration'
import { canExecuteAction } from './canExecuteAction'
import { dispatchAction } from './dispatch'
import { getActionDefinition } from './definitions'
import { formatActionNarration } from './formatActionNarration'
import { getActionDuration } from './getActionDuration'

export function executeAction(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): boolean {
  if (!canExecuteAction(state, characterId, resolved)) return false

  const definition = getActionDefinition(resolved.actionId)
  if (!definition) return false

  const duration = getActionDuration(state, characterId, resolved)
  if (!duration) return false

  const dispatched = dispatchAction(
    state,
    characterId,
    definition.handler,
    resolved.parameters,
  )
  if (!dispatched) return false
  if (duration === 'long') {
    const character = state.characters.find((entry) => entry.id === characterId)
    if (character) {
      character.turnBudget.longActionUsed = true
    }
  }

  const narration = formatActionNarration(
    state,
    characterId,
    resolved,
    duration,
  )
  if (narration) {
    appendNarration(state, narration)
  }

  return true
}
