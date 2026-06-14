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
  getAllCharacters,
  getAllies,
  getCharacterById,
  getCharactersByNpcType,
  getPlayerCharacter,
} from './characters'
import {
  bootstrapGame,
  loadGame,
  QUICKSAVE_NAME,
  saveGame,
} from './persistence'
import {
  createPlace,
  getCharactersAtPlace,
  getPlaceById,
  getPlacesInRegion,
  getRegionById,
  getRegionForPlace,
  goTo,
} from './places'
import {
  addResourceStock,
  getResourceAmount,
  getResourceById,
  getResourcesBySubtype,
  getResourcesByType,
  hasResourceStock,
  subtractResourceStock,
} from './resources'
import { getDashboardTimeLabel, getTimeString, passTurn } from './time'

/** Start or restart the game from static content. */
export function engineInitializeGame(): void {
  initializeGame()
}

/** Load the latest save on startup, or seed from static content. */
export function engineBootstrapGame(): Promise<void> {
  return bootstrapGame()
}

/** Persist the current simulation under a named save slot. */
export function engineSaveGame(name: string): Promise<void> {
  return saveGame(name)
}

/** Restore simulation state from a named save slot. */
export function engineLoadGame(name: string): Promise<boolean> {
  return loadGame(name)
}

export { QUICKSAVE_NAME }

/** Advance the simulation by one period and reset turn budgets. */
export function enginePassTurn(): void {
  passTurn(gameState)
  resetTurnBudgets(gameState)
}

/** Human-readable calendar date for the current simulation day. */
export function engineGetTimeString(): string {
  return getTimeString(gameState.time, gameConfig.startDate)
}

/** Compact time label for the dashboard home view. */
export function engineGetDashboardTimeLabel() {
  return getDashboardTimeLabel(gameState.time, gameConfig.startDate)
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

/** Look up a character by id. */
export function engineGetCharacterById(characterId: string) {
  return getCharacterById(gameState, characterId)
}

/** Return the player character. */
export function engineGetPlayerCharacter() {
  return getPlayerCharacter(gameState)
}

/** Return every character in the simulation. */
export function engineGetAllCharacters() {
  return getAllCharacters(gameState)
}

/** Return all NPCs with the given type. */
export function engineGetCharactersByNpcType(
  npcType: Parameters<typeof getCharactersByNpcType>[1],
) {
  return getCharactersByNpcType(gameState, npcType)
}

/** Return all ally NPCs. */
export function engineGetAllies() {
  return getAllies(gameState)
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

/** Look up a resource stock entry by id. */
export function engineGetResourceById(resourceId: string) {
  return getResourceById(gameState, resourceId)
}

/** Return all stock entries matching a resource type. */
export function engineGetResourcesByType(
  type: Parameters<typeof getResourcesByType>[1],
) {
  return getResourcesByType(gameState, type)
}

/** Return all stock entries matching a resource subtype. */
export function engineGetResourcesBySubtype(
  subtype: Parameters<typeof getResourcesBySubtype>[1],
) {
  return getResourcesBySubtype(gameState, subtype)
}

/** Return current stock amount for a resource, or 0 if none. */
export function engineGetResourceAmount(resourceId: string): number {
  return getResourceAmount(gameState, resourceId)
}

/** Check whether stock is sufficient without mutating state. */
export function engineHasResourceStock(
  resourceId: string,
  amount: number,
): boolean {
  return hasResourceStock(gameState, resourceId, amount)
}

/** Increase stock for a resource. */
export function engineAddResourceStock(
  resourceId: string,
  amount: number,
): void {
  addResourceStock(gameState, resourceId, amount)
}

/** Decrease stock for a resource. */
export function engineSubtractResourceStock(
  resourceId: string,
  amount: number,
): void {
  subtractResourceStock(gameState, resourceId, amount)
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
) {
  return executeAction(gameState, characterId, resolved)
}

export { initializeGame } from './bootstrap/initializeGame'
