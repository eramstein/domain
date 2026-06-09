/** A character in the simulation. */
export interface Character {
  id: string
  name: string
  isPlayer: boolean
}

/** A discrete location in the domain. */
export interface Place {
  id: string
  name: string
}

/** A quantified resource stockpile. */
export interface Resource {
  id: string
  name: string
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
  characters: Character[]
  places: Place[]
  resources: Resource[]
  narration: NarrationEntry[]
}
