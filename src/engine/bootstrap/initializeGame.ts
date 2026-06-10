import {
  characterSeeds,
  eventSeeds,
  placeSeeds,
  regionSeeds,
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

  gameState.regions = regionSeeds.map((seed) => ({
    id: seed.id,
    name: seed.name,
  }))

  gameState.places = placeSeeds.map((seed) => ({
    id: seed.id,
    name: seed.name,
    regionId: seed.regionId,
  }))

  gameState.characters = characterSeeds.map((seed) => ({
    id: seed.id,
    name: seed.name,
    isPlayer: seed.isPlayer,
    placeId: seed.initialPlaceId,
    turnBudget: { longActionUsed: false },
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
