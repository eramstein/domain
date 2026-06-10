import type { GameState, ResolvedAction } from '@/types'

import { getActionDuration } from './getActionDuration'
import { isValidResolvedAction } from './validateAction'

export function canExecuteAction(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): boolean {
  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character) return false
  if (!isValidResolvedAction(state, resolved)) return false

  const duration = getActionDuration(state, characterId, resolved)
  if (!duration) return false

  if (duration === 'long' && character.turnBudget.longActionUsed) {
    return false
  }

  return true
}
