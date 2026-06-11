import type { ActionExecutionResult, GameState, ResolvedAction } from '@/types'

import { appendNarration } from '../narration/appendNarration'
import { dispatchAction } from './dispatch'
import { getActionDefinition } from './definitions'
import { formatActionNarration } from './formatActionNarration'
import { getActionDuration } from './getActionDuration'
import { getActionFailureMessage } from './getActionFailureMessage'

export function executeAction(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): ActionExecutionResult {
  const failureMessage = getActionFailureMessage(state, characterId, resolved)
  if (failureMessage) {
    return { success: false, message: failureMessage }
  }

  const definition = getActionDefinition(resolved.actionId)
  if (!definition) {
    return { success: false, message: "You can't do that right now." }
  }

  const duration = getActionDuration(state, characterId, resolved)
  if (!duration) {
    return { success: false, message: "You can't do that right now." }
  }

  const dispatched = dispatchAction(
    state,
    characterId,
    definition.handler,
    resolved.parameters,
  )
  if (!dispatched) {
    return { success: false, message: "You can't do that right now." }
  }
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

  return { success: true }
}
