import type {
  GameState,
  Resource,
  ResourceSubtype,
  ResourceType,
} from '@/types'

export function getResourceById(
  state: GameState,
  resourceId: string,
): Resource | undefined {
  return state.resources.find((resource) => resource.id === resourceId)
}

export function getResourcesByType(
  state: GameState,
  type: ResourceType,
): Resource[] {
  return state.resources.filter((resource) => resource.type === type)
}

export function getResourcesBySubtype(
  state: GameState,
  subtype: ResourceSubtype,
): Resource[] {
  return state.resources.filter((resource) => resource.subtype === subtype)
}

export function getResourceAmount(
  state: GameState,
  resourceId: string,
): number {
  return getResourceById(state, resourceId)?.amount ?? 0
}
