import { resourceSeeds } from '@data/index'
import type { GameState } from '@/types'

import { getResourceById } from './lookups'

export function hasResourceStock(
  state: GameState,
  resourceId: string,
  amount: number,
): boolean {
  if (amount <= 0) return false
  return (getResourceById(state, resourceId)?.amount ?? 0) >= amount
}

/** Increase stock for a resource, creating an entry from catalog seeds when needed. */
export function addResourceStock(
  state: GameState,
  resourceId: string,
  amount: number,
): void {
  if (amount <= 0) return

  const existing = getResourceById(state, resourceId)
  if (existing) {
    existing.amount += amount
    return
  }

  const seed = resourceSeeds.find((entry) => entry.id === resourceId)
  if (!seed) return

  state.resources.push({
    id: seed.id,
    name: seed.name,
    type: seed.type,
    subtype: seed.subtype,
    amount,
  })
}

/** Decrease stock for a resource. No-op when stock is insufficient. */
export function subtractResourceStock(
  state: GameState,
  resourceId: string,
  amount: number,
): void {
  if (amount <= 0) return

  const existing = getResourceById(state, resourceId)
  if (!existing || existing.amount < amount) return

  existing.amount -= amount
}
