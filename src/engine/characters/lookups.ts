import type { Character, GameState, NpcType } from '@/types'

export function getCharacterById(
  state: GameState,
  characterId: string,
): Character | undefined {
  return state.characters.find((character) => character.id === characterId)
}

export function getPlayerCharacter(state: GameState): Character | undefined {
  return state.characters.find((character) => character.isPlayer)
}

export function getAllCharacters(state: GameState): Character[] {
  return state.characters
}

export function getCharactersByNpcType(
  state: GameState,
  npcType: NpcType,
): Character[] {
  return state.characters.filter((character) => character.npcType === npcType)
}

export function getAllies(state: GameState): Character[] {
  return getCharactersByNpcType(state, 'ally')
}
