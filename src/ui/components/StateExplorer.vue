<script setup lang="ts">
import { computed } from 'vue'

import type {
  Character,
  GameTime,
  Place,
  Region,
  Resource,
  ResourceSubtype,
  ResourceType,
} from '@/types'

const props = defineProps<{
  time: GameTime
  timeString: string
  characters: readonly Character[]
  regions: readonly Region[]
  places: readonly Place[]
  resources: readonly Resource[]
}>()

const placeById = computed(() => {
  const map = new Map<string, Place>()
  for (const place of props.places) {
    map.set(place.id, place)
  }
  return map
})

const resourceById = computed(() => {
  const map = new Map<string, Resource>()
  for (const resource of props.resources) {
    map.set(resource.id, resource)
  }
  return map
})

function resourceName(resourceId: string): string {
  return resourceById.value.get(resourceId)?.name ?? resourceId
}

const regionsWithPlaces = computed(() =>
  props.regions.map((region) => ({
    region,
    places: props.places.filter((place) => place.regionId === region.id),
  })),
)

function placeName(placeId: string): string {
  return placeById.value.get(placeId)?.name ?? '—'
}

const resourceTypeLabels: Record<ResourceType, string> = {
  constructionMaterial: 'Construction material',
  food: 'Food',
  valuable: 'Valuable',
}

const resourceSubtypeLabels: Record<ResourceSubtype, string> = {
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

function resourceCategory(resource: Resource): string {
  return `${resourceTypeLabels[resource.type]} · ${resourceSubtypeLabels[resource.subtype]}`
}
</script>

<template>
  <section class="state-explorer">
    <h2 class="heading">Domain</h2>

    <div class="section">
      <h3>Time</h3>
      <p class="time-date">{{ timeString }}</p>
      <p class="time-period">{{ time.period }}</p>
    </div>

    <div class="section">
      <h3>Characters</h3>
      <ul>
        <li v-for="character in characters" :key="character.id">
          <span class="character-label">
            <span class="name">{{ character.name }}</span>
            <span v-if="character.isPlayer" class="tag">you</span>
          </span>
          <span class="meta">
            <span class="location">{{ placeName(character.placeId) }}</span>
            <span
              v-if="character.isPlayer && character.turnBudget.longActionUsed"
              class="budget"
            >
              long used
            </span>
          </span>
        </li>
        <li v-if="characters.length === 0" class="empty">—</li>
      </ul>
    </div>

    <div class="section">
      <h3>Places</h3>
      <ul v-if="regionsWithPlaces.length > 0" class="region-list">
        <li
          v-for="{ region, places: regionPlaces } in regionsWithPlaces"
          :key="region.id"
          class="region-group"
        >
          <span class="region-name">{{ region.name }}</span>
          <ul class="place-list">
            <li v-for="place in regionPlaces" :key="place.id" class="place-item">
              <span class="place-name">{{ place.name }}</span>
              <ul
                v-if="place.naturalResources.length > 0"
                class="natural-resource-list"
              >
                <li
                  v-for="naturalResource in place.naturalResources"
                  :key="naturalResource.resourceId"
                >
                  <span>{{ resourceName(naturalResource.resourceId) }}</span>
                  <span class="abundance">{{ naturalResource.abundance }}</span>
                </li>
              </ul>
            </li>
            <li v-if="regionPlaces.length === 0" class="empty">—</li>
          </ul>
        </li>
      </ul>
      <p v-else class="empty">—</p>
    </div>

    <div class="section">
      <h3>Resources</h3>
      <ul>
        <li v-for="resource in resources" :key="resource.id">
          <span class="resource-label">
            <span class="name">{{ resource.name }}</span>
            <span class="category">{{ resourceCategory(resource) }}</span>
          </span>
          <span class="amount">{{ resource.amount }}</span>
        </li>
        <li v-if="resources.length === 0" class="empty">—</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.state-explorer {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.heading {
  margin: 0 0 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.section {
  margin-bottom: 1.5rem;
}

.section h3 {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
  font-size: 0.95rem;
}

.character-label,
.resource-label {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
}

.character-label {
  flex-direction: row;
  align-items: baseline;
  gap: 0.5rem;
}

.category {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.name {
  font-weight: 500;
}

.meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.15rem;
  flex-shrink: 0;
}

.location {
  color: var(--text-muted);
  text-align: right;
}

.budget {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.amount {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

.tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.empty {
  color: var(--text-muted);
}

.region-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.region-group {
  display: block;
  padding: 0;
}

.region-name {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
  font-weight: 500;
}

.place-list .place-item {
  display: block;
  padding: 0.2rem 0 0.2rem 0.75rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.place-name {
  display: block;
}

.natural-resource-list {
  margin: 0.15rem 0 0;
  padding-left: 0.75rem;
}

.natural-resource-list li {
  padding: 0.1rem 0;
  font-size: 0.8rem;
}

.abundance {
  font-variant-numeric: tabular-nums;
}

.time-date {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.time-period {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
