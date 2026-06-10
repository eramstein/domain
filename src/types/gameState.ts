import type { TurnBudget } from './actions'
import type { ResourceSubtype, ResourceType } from './content'

/** A geographic zone containing one or more places. */
export interface Region {
  id: string
  name: string
}

/** A character in the simulation. */
export interface Character {
  id: string
  name: string
  isPlayer: boolean
  placeId: string
  turnBudget: TurnBudget
}

/** A discrete location within a region. */
export interface Place {
  id: string
  name: string
  regionId: string
}

/** A quantified resource stockpile. */
export interface Resource {
  id: string
  name: string
  type: ResourceType
  subtype: ResourceSubtype
  amount: number
}

/** A block of narrative text shown in the narration panel. */
export interface NarrationEntry {
  id: string
  text: string
}

import type { GameTime } from './time'

export type { GameTime, TimePeriod } from './time'

/**
 * Complete runtime simulation state.
 * UI concerns do not belong here.
 */
export interface GameState {
  time: GameTime
  regions: Region[]
  places: Place[]
  characters: Character[]
  resources: Resource[]
  narration: NarrationEntry[]
}
