import {
  characterSeeds,
  eventSeeds,
  placeSeeds,
  resourceSeeds,
} from '@data/index'
import { INITIAL_GAME_TIME } from '@/types/time'
import { gameState, resetGameState } from '@state/gameState'

/**
 * Seed GameState from static JSON content.
 */
export function initializeGame(): void {
  resetGameState()

  gameState.time = { ...INITIAL_GAME_TIME }

  gameState.characters = characterSeeds.map((seed) => ({
    id: seed.id,
    name: seed.name,
    isPlayer: seed.isPlayer,
  }))

  gameState.places = placeSeeds.map((seed) => ({
    id: seed.id,
    name: seed.name,
  }))

  gameState.resources = resourceSeeds.map((seed) => ({
    id: seed.id,
    name: seed.name,
    amount: seed.initialAmount,
  }))

  gameState.narration = eventSeeds.map((seed) => ({
    id: seed.id,
    text: seed.text,
  }))
}
