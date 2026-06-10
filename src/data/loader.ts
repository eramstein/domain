import type {
  ActionSeed,
  CharacterSeed,
  EventSeed,
  GameConfig,
  PlaceSeed,
  RegionSeed,
  ResourceSeed,
} from '@/types'

import actionsJson from './actions.json'
import charactersJson from './characters.json'
import eventsJson from './events.json'
import gameConfigJson from './gameConfig.json'
import placesJson from './places.json'
import regionsJson from './regions.json'
import resourcesJson from './resources.json'

export const gameConfig: GameConfig = gameConfigJson
export const actionSeeds = actionsJson as readonly ActionSeed[]
export const characterSeeds: readonly CharacterSeed[] = charactersJson
export const regionSeeds: readonly RegionSeed[] = regionsJson
export const placeSeeds: readonly PlaceSeed[] = placesJson
export const resourceSeeds: readonly ResourceSeed[] = resourcesJson
export const eventSeeds: readonly EventSeed[] = eventsJson
