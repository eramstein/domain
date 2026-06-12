<script setup lang="ts">
import { computed } from 'vue'

import { useGameState } from '@state/useGameState'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'
import type { ResourceSubtype, ResourceType } from '@/types'

import {
  resourceSubtypeLabel,
  resourceTypeLabel,
} from '../../../composables/useResourceLabels'

const nav = useDashboardNavigation()
const gameState = useGameState()

interface ResourceAggregate {
  type: ResourceType
  subtype: ResourceSubtype
  total: number
}

const aggregates = computed(() => {
  const map = new Map<string, ResourceAggregate>()

  for (const resource of gameState.resources) {
    const key = `${resource.type}:${resource.subtype}`
    const existing = map.get(key)
    if (existing) {
      existing.total += resource.amount
    } else {
      map.set(key, {
        type: resource.type,
        subtype: resource.subtype,
        total: resource.amount,
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
  <section class="dash-widget">
    <button
      type="button"
      class="dash-widget-title"
      @click="nav.openTopic('resources')"
    >
      Resources
    </button>
    <ul class="dash-list">
      <li v-for="aggregate in aggregates" :key="`${aggregate.type}:${aggregate.subtype}`">
        <span class="dash-meta" style="text-align: left">
          {{ resourceTypeLabel(aggregate.type) }} ·
          {{ resourceSubtypeLabel(aggregate.subtype) }}
        </span>
        <span class="dash-amount">{{ aggregate.total }}</span>
      </li>
      <li v-if="aggregates.length === 0" class="dash-empty">—</li>
    </ul>
  </section>
</template>
