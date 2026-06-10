import type { ActionSeed, GameState, ResolvedAction } from '@/types'
import { type ActionTool, llmService } from '@/services/llm/llmService'

import { getActionDefinitions, resolveEnumValues } from './definitions'

function buildActionTools(
  state: GameState,
  definitions: readonly ActionSeed[],
): ActionTool[] {
  return definitions.map((definition) => ({
    id: definition.id,
    name: definition.name,
    description: definition.description,
    parameters: definition.parameters.map((parameter) => ({
      name: parameter.name,
      type: parameter.type,
      description: parameter.description,
      enum: parameter.enumSource
        ? resolveEnumValues(state, parameter.enumSource)
        : undefined,
    })),
  }))
}

function buildPlaceLabels(state: GameState): { id: string; name: string }[] {
  return state.places.map((place) => ({ id: place.id, name: place.name }))
}

export async function findActionsInText(
  state: GameState,
  characterId: string,
  text: string,
): Promise<ResolvedAction[]> {
  const character = state.characters.find((entry) => entry.id === characterId)
  if (!character) return []

  const tools = buildActionTools(state, getActionDefinitions())
  return llmService.resolveActions(text, tools, buildPlaceLabels(state))
}
