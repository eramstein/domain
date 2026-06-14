import type { GameState, ResolvedAction } from '@/types'

import { getFirstRequirementFailure } from './requirements/registry'

export function checkActionRequirements(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): string | undefined {
  return getFirstRequirementFailure(state, characterId, resolved)?.message
}
