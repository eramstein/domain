import type { Character, CharacterSeed } from '@/types'

/** Build a runtime character record from static seed content. */
export function characterFromSeed(seed: CharacterSeed): Character {
  return {
    id: seed.id,
    name: seed.name,
    isPlayer: seed.isPlayer,
    npcType: seed.isPlayer ? undefined : seed.npcType,
    physicalDescription: seed.physicalDescription,
    portrait: seed.portrait,
    personalityDescription: seed.personalityDescription,
    personalityTraits: [...seed.personalityTraits],
    attributes: { ...seed.attributes },
    health: seed.health,
    placeId: seed.initialPlaceId,
    turnBudget: { longActionUsed: false },
    order: null,
    actionQueue: [],
  }
}
