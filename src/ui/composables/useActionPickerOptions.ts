import { useGameState } from '@state/useGameState'
import type { ActionParameterSeed } from '@/types'

import { useDashboardLookups } from './useDashboardLookups'

export interface PickerOption {
  id: string
  label: string
  hint?: string
}

export function useActionPickerOptions() {
  const gameState = useGameState()
  const { regionName, resourceById, placeById } = useDashboardLookups()

  function getOptionsForParameter(
    actionId: string,
    parameter: ActionParameterSeed,
    partialParams: Record<string, string>,
  ): PickerOption[] {
    if (parameter.enumSource === 'places') {
      let places = gameState.places

      if (actionId === 'collect-resource') {
        places = places.filter((place) =>
          place.naturalResources.some(
            (naturalResource) => naturalResource.abundance > 0,
          ),
        )
      }

      return places.map((place) => ({
        id: place.id,
        label: place.name,
        hint: regionName(place.regionId),
      }))
    }

    if (parameter.enumSource === 'resources') {
      const placeId = partialParams.placeId

      if (actionId === 'collect-resource' && placeId) {
        const place = placeById.value.get(placeId)
        if (!place) return []

        return place.naturalResources
          .filter((naturalResource) => naturalResource.abundance > 0)
          .map((naturalResource) => {
            const resource = resourceById.value.get(naturalResource.resourceId)
            return {
              id: naturalResource.resourceId,
              label: resource?.name ?? naturalResource.resourceId,
            }
          })
      }

      return gameState.resources.map((resource) => ({
        id: resource.id,
        label: resource.name,
      }))
    }

    if (parameter.enumSource === 'characters') {
      return gameState.characters.map((character) => ({
        id: character.id,
        label: character.name,
      }))
    }

    return []
  }

  return { getOptionsForParameter }
}
