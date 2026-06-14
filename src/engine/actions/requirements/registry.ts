import type { GameState, ResolvedAction } from '@/types'

import {
  checkCollectResourceAtPlace,
  checkCollectResourcePresent,
} from './collectResource'
import type { RequirementFailure, RequirementKind } from './types'

export interface RequirementRule {
  kind: RequirementKind
  check: (
    state: GameState,
    characterId: string,
    resolved: ResolvedAction,
  ) => RequirementFailure | undefined
  getPrerequisite?: (
    state: GameState,
    characterId: string,
    resolved: ResolvedAction,
    failure: RequirementFailure,
  ) => ResolvedAction | null
}

const requirementRulesByAction: Record<string, RequirementRule[]> = {
  'collect-resource': [
    {
      kind: 'at-place',
      check: checkCollectResourceAtPlace,
      getPrerequisite: (_state, _characterId, _resolved, failure) => {
        if (!failure.placeId) return null
        return {
          actionId: 'goto',
          parameters: { placeId: failure.placeId },
        }
      },
    },
    {
      kind: 'resource-at-place',
      check: checkCollectResourcePresent,
    },
  ],
}

export function getRequirementRules(actionId: string): RequirementRule[] {
  return requirementRulesByAction[actionId] ?? []
}

export function getFirstRequirementFailure(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): RequirementFailure | undefined {
  for (const rule of getRequirementRules(resolved.actionId)) {
    const failure = rule.check(state, characterId, resolved)
    if (failure) return failure
  }

  return undefined
}

export function getRemediablePrerequisite(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): ResolvedAction | null {
  for (const rule of getRequirementRules(resolved.actionId)) {
    const failure = rule.check(state, characterId, resolved)
    if (!failure || !rule.getPrerequisite) continue

    return rule.getPrerequisite(state, characterId, resolved, failure)
  }

  return null
}
