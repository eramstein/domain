import type { Character, GameState, Place, Region } from '@/types'

export function getPlaceById(
  state: GameState,
  placeId: string,
): Place | undefined {
  return state.places.find((place) => place.id === placeId)
}

export function getRegionById(
  state: GameState,
  regionId: string,
): Region | undefined {
  return state.regions.find((region) => region.id === regionId)
}

export function getRegionForPlace(
  state: GameState,
  placeId: string,
): Region | undefined {
  const place = getPlaceById(state, placeId)
  if (!place) return undefined
  return getRegionById(state, place.regionId)
}

export function getPlacesInRegion(
  state: GameState,
  regionId: string,
): Place[] {
  return state.places.filter((place) => place.regionId === regionId)
}

export function getCharactersAtPlace(
  state: GameState,
  placeId: string,
): Character[] {
  return state.characters.filter((character) => character.placeId === placeId)
}
