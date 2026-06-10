/** Static character seed loaded from JSON. */
export interface CharacterSeed {
  id: string
  name: string
  isPlayer: boolean
  initialPlaceId: string
}

/** Static region seed loaded from JSON. */
export interface RegionSeed {
  id: string
  name: string
}

/** Static place seed loaded from JSON. */
export interface PlaceSeed {
  id: string
  name: string
  regionId: string
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

/** Static action parameter schema loaded from JSON. */
export interface ActionParameterSeed {
  name: string
  type: 'string' | 'number' | 'boolean'
  description: string
  enumSource?: 'places' | 'characters'
}

/** Static action definition loaded from JSON. */
export interface ActionSeed {
  id: string
  name: string
  description: string
  parameters: ActionParameterSeed[]
  handler: string
}
