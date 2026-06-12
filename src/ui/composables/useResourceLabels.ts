import type { ResourceSubtype, ResourceType } from '@/types'

export const resourceTypeLabels: Record<ResourceType, string> = {
  constructionMaterial: 'Construction material',
  food: 'Food',
  valuable: 'Valuable',
}

export const resourceSubtypeLabels: Record<ResourceSubtype, string> = {
  wood: 'Wood',
  stone: 'Stone',
  clay: 'Clay',
  metal: 'Metal',
  reed: 'Reed',
  grain: 'Grain',
  meat: 'Meat',
  fish: 'Fish',
  vegetable: 'Vegetable',
  fruit: 'Fruit',
  dairy: 'Dairy',
  beverage: 'Beverage',
  coin: 'Coin',
  spice: 'Spice',
  cloth: 'Cloth',
  salt: 'Salt',
}

export function resourceTypeLabel(type: ResourceType): string {
  return resourceTypeLabels[type]
}

export function resourceSubtypeLabel(subtype: ResourceSubtype): string {
  return resourceSubtypeLabels[subtype]
}

export function resourceCategory(
  type: ResourceType,
  subtype: ResourceSubtype,
): string {
  return `${resourceTypeLabels[type]} · ${resourceSubtypeLabels[subtype]}`
}
