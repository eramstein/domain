import type { GameState, ResolvedAction } from '@/types'

import { getActionFailureMessage } from './getActionFailureMessage'

export function canExecuteAction(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): boolean {
  return getActionFailureMessage(state, characterId, resolved) === undefined
}
