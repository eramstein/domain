import { actionSeeds } from '@data/index'
import type { ResolvedAction } from '@/types'

export function formatResolvedActionLabel(
  resolved: ResolvedAction,
  placeName: (placeId: string) => string,
  resourceName: (resourceId: string) => string,
): string {
  const definition = actionSeeds.find((action) => action.id === resolved.actionId)
  if (!definition) return 'Unknown action'

  if (resolved.actionId === 'goto') {
    const placeId = resolved.parameters.placeId
    if (typeof placeId !== 'string') return definition.name
    return `${definition.name}: ${placeName(placeId)}`
  }

  if (resolved.actionId === 'collect-resource') {
    const placeId = resolved.parameters.placeId
    const resourceId = resolved.parameters.resourceId
    if (typeof placeId !== 'string' || typeof resourceId !== 'string') {
      return definition.name
    }
    return `${definition.name}: ${resourceName(resourceId)} at ${placeName(placeId)}`
  }

  return definition.name
}
