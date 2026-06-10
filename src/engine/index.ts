import { gameConfig } from '@data/index'
import { gameState } from '@state/gameState'
import type { ResolvedAction } from '@/types'

import {
  canExecuteAction,
  executeAction,
  findActionsInText,
  getActionDuration,
  resetTurnBudgets,
} from './actions'
import { initializeGame } from './bootstrap/initializeGame'
import {
  createPlace,
  getCharactersAtPlace,
  getPlaceById,
  getPlacesInRegion,
  getRegionById,
  getRegionForPlace,
  goTo,
} from './places'
import { getTimeString, passTurn } from './time'

/** Start or restart the game from static content. */
export function engineInitializeGame(): void {
  initializeGame()
}

/** Advance the simulation by one period and reset turn budgets. */
export function enginePassTurn(): void {
  passTurn(gameState)
  resetTurnBudgets(gameState)
}

/** Human-readable calendar date for the current simulation day. */
export function engineGetTimeString(): string {
  return getTimeString(gameState.time, gameConfig.startDate)
}

/** Look up a place by id. */
export function engineGetPlaceById(placeId: string) {
  return getPlaceById(gameState, placeId)
}

/** Look up a region by id. */
export function engineGetRegionById(regionId: string) {
  return getRegionById(gameState, regionId)
}

/** Return the region that contains the given place. */
export function engineGetRegionForPlace(placeId: string) {
  return getRegionForPlace(gameState, placeId)
}

/** Return all places in a region. */
export function engineGetPlacesInRegion(regionId: string) {
  return getPlacesInRegion(gameState, regionId)
}

/** Return all characters currently at a place. */
export function engineGetCharactersAtPlace(placeId: string) {
  return getCharactersAtPlace(gameState, placeId)
}

/** Move a character to a new place. */
export function engineGoTo(characterId: string, placeId: string): void {
  goTo(gameState, characterId, placeId)
}

/** Add a new place at runtime. */
export function engineCreatePlace(
  place: Parameters<typeof createPlace>[1],
): void {
  createPlace(gameState, place)
}

/** Parse free-text into resolved actions via the LLM. */
export function engineFindActionsInText(
  characterId: string,
  text: string,
): Promise<ResolvedAction[]> {
  return findActionsInText(gameState, characterId, text)
}

/** Classify a resolved action as long or short. */
export function engineGetActionDuration(
  characterId: string,
  resolved: ResolvedAction,
) {
  return getActionDuration(gameState, characterId, resolved)
}

/** Check whether a resolved action can run this turn. */
export function engineCanExecuteAction(
  characterId: string,
  resolved: ResolvedAction,
): boolean {
  return canExecuteAction(gameState, characterId, resolved)
}

/** Validate, dispatch, and update turn budget for a resolved action. */
export function engineExecuteAction(
  characterId: string,
  resolved: ResolvedAction,
): boolean {
  return executeAction(gameState, characterId, resolved)
}

export { initializeGame } from './bootstrap/initializeGame'
