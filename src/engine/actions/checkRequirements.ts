import type { GameState, ResolvedAction } from '@/types'

import { checkCollectResourceRequirements } from './requirements/collectResource'

export function checkActionRequirements(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): string | undefined {
  if (resolved.actionId === 'collect-resource') {
    return checkCollectResourceRequirements(state, characterId, resolved)
  }

  return undefined
}
