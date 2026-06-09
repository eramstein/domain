/** Static character seed loaded from JSON. */
export interface CharacterSeed {
  id: string
  name: string
  isPlayer: boolean
}

/** Static place seed loaded from JSON. */
export interface PlaceSeed {
  id: string
  name: string
}

/** Static resource seed with starting amount. */
export interface ResourceSeed {
  id: string
  name: string
  initialAmount: number
}

/** Static narrative event seed loaded from JSON. */
export interface EventSeed {
  id: string
  text: string
}
