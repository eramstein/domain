import type { GameState, ResolvedAction } from '@/types'

import { getPlaceById } from '../places/lookups'
import { getActionDefinition, resolveEnumValues } from './definitions'

export function isValidResolvedAction(
  state: GameState,
  resolved: ResolvedAction,
): boolean {
  const definition = getActionDefinition(resolved.actionId)
  if (!definition) return false

  for (const parameter of definition.parameters) {
    const value = resolved.parameters[parameter.name]
    if (value === undefined) return false

    if (parameter.type === 'string' && typeof value !== 'string') return false
    if (parameter.type === 'number' && typeof value !== 'number') return false
    if (parameter.type === 'boolean' && typeof value !== 'boolean') return false

    if (parameter.enumSource) {
      const allowed = resolveEnumValues(state, parameter.enumSource)
      if (!allowed.includes(String(value))) return false
    }
  }

  if (resolved.actionId === 'goto') {
    const placeId = resolved.parameters.placeId
    if (typeof placeId !== 'string') return false
    if (!getPlaceById(state, placeId)) return false
  }

  return true
}
