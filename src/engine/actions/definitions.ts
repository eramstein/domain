import { actionSeeds } from '@data/index'
import type { ActionSeed, GameState } from '@/types'

export function getActionDefinitions(): readonly ActionSeed[] {
  return actionSeeds
}

export function getActionDefinition(
  actionId: string,
): ActionSeed | undefined {
  return actionSeeds.find((action) => action.id === actionId)
}

export function resolveEnumValues(
  state: GameState,
  enumSource: 'places' | 'characters' | 'resources',
): string[] {
  if (enumSource === 'places') {
    return state.places.map((place) => place.id)
  }

  if (enumSource === 'resources') {
    return state.resources.map((resource) => resource.id)
  }

  return state.characters.map((character) => character.id)
}
