/** Classification for non-player characters. */
export type NpcType = 'ally' | 'neutral' | 'enemy'

/** Simple health status for the vertical slice. */
export type CharacterHealth = 'healthy' | 'sick'

/** RPG-style character stats. */
export interface CharacterAttributes {
  strength: number
  vitality: number
  intelligence: number
}
