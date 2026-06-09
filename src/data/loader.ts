import type {
  CharacterSeed,
  EventSeed,
  GameConfig,
  PlaceSeed,
  ResourceSeed,
} from '@/types'

import charactersJson from './characters.json'
import eventsJson from './events.json'
import gameConfigJson from './gameConfig.json'
import placesJson from './places.json'
import resourcesJson from './resources.json'

export const gameConfig: GameConfig = gameConfigJson
export const characterSeeds: readonly CharacterSeed[] = charactersJson
export const placeSeeds: readonly PlaceSeed[] = placesJson
export const resourceSeeds: readonly ResourceSeed[] = resourcesJson
export const eventSeeds: readonly EventSeed[] = eventsJson
