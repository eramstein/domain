import type { GameState, ResolvedAction } from '@/types'

import { checkActionRequirements } from './checkRequirements'
import { getActionDuration } from './getActionDuration'
import { isValidResolvedAction } from './validateAction'

export function getActionFailureMessage(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): string | undefined {
  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character) return "You can't do that right now."

  if (!isValidResolvedAction(state, resolved)) {
    return "You can't do that right now."
  }

  const duration = getActionDuration(state, characterId, resolved)
  if (!duration) return "You can't do that right now."

  if (duration === 'long' && character.turnBudget.longActionUsed) {
    if (character.isPlayer) {
      return 'You already used your long action this turn.'
    }
    return `${character.name} already used their long action this turn.`
  }

  return checkActionRequirements(state, characterId, resolved)
}
