import { computed } from 'vue'

import { useGameState } from '@state/useGameState'

export function useDashboardLookups() {
  const gameState = useGameState()

  const placeById = computed(() => {
    const map = new Map(gameState.places.map((place) => [place.id, place]))
    return map
  })

  const regionById = computed(() => {
    const map = new Map(gameState.regions.map((region) => [region.id, region]))
    return map
  })

  const resourceById = computed(() => {
    const map = new Map(
      gameState.resources.map((resource) => [resource.id, resource]),
    )
    return map
  })

  const characterById = computed(() => {
    const map = new Map(
      gameState.characters.map((character) => [character.id, character]),
    )
    return map
  })

  function placeName(placeId: string): string {
    return placeById.value.get(placeId)?.name ?? '—'
  }

  function regionName(regionId: string): string {
    return regionById.value.get(regionId)?.name ?? '—'
  }

  function resourceName(resourceId: string): string {
    return resourceById.value.get(resourceId)?.name ?? resourceId
  }

  const regionsWithPlaces = computed(() =>
    gameState.regions.map((region) => ({
      region,
      places: gameState.places.filter((place) => place.regionId === region.id),
    })),
  )

  function charactersAtPlace(placeId: string) {
    return gameState.characters.filter(
      (character) => character.placeId === placeId,
    )
  }

  return {
    placeById,
    regionById,
    resourceById,
    characterById,
    placeName,
    regionName,
    resourceName,
    regionsWithPlaces,
    charactersAtPlace,
  }
}
