<script setup lang="ts">
import { computed } from 'vue'

import { useGameState } from '@state/useGameState'
import type { Resource, ResourceSubtype, ResourceType } from '@/types'

import {
  resourceSubtypeLabel,
  resourceTypeLabel,
} from '../../../composables/useResourceLabels'

const gameState = useGameState()

interface ResourceGroup {
  type: ResourceType
  subtype: ResourceSubtype
  resources: Resource[]
}

const groups = computed(() => {
  const map = new Map<string, ResourceGroup>()

  for (const resource of gameState.resources) {
    const key = `${resource.type}:${resource.subtype}`
    const existing = map.get(key)
    if (existing) {
      existing.resources.push(resource)
    } else {
      map.set(key, {
        type: resource.type,
        subtype: resource.subtype,
        resources: [resource],
      })
    }
  }

  return [...map.values()].sort((a, b) => {
    const typeOrder = a.type.localeCompare(b.type)
    if (typeOrder !== 0) return typeOrder
    return a.subtype.localeCompare(b.subtype)
  })
})
</script>

<template>
  <div class="resources-topic">
    <section
      v-for="group in groups"
      :key="`${group.type}:${group.subtype}`"
      class="dash-widget"
    >
      <h3 class="group-heading">
        {{ resourceTypeLabel(group.type) }} ·
        {{ resourceSubtypeLabel(group.subtype) }}
      </h3>
      <ul class="dash-list">
        <li v-for="resource in group.resources" :key="resource.id">
          <span class="dash-name">{{ resource.name }}</span>
          <span class="dash-amount">{{ resource.amount }}</span>
        </li>
      </ul>
    </section>
    <p v-if="groups.length === 0" class="dash-empty">—</p>
  </div>
</template>

<style scoped>
.group-heading {
  margin: 0 0 0.5rem;
  font-size: 0.85rem;
  font-weight: 500;
}
</style>
