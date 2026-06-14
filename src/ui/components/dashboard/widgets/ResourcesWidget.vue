<script setup lang="ts">
import { computed } from 'vue'

import { useGameState } from '@state/useGameState'
import type { ResourceSubtype, ResourceType } from '@/types'

import {
  resourceSubtypeLabel,
  resourceTypeLabel,
} from '../../../composables/useResourceLabels'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'

const nav = useDashboardNavigation()
const gameState = useGameState()

interface SubtypeTotal {
  subtype: ResourceSubtype
  total: number
}

interface TypeGroup {
  type: ResourceType
  subtypes: SubtypeTotal[]
}

const typeGroups = computed((): TypeGroup[] => {
  const byType = new Map<ResourceType, Map<ResourceSubtype, number>>()

  for (const resource of gameState.resources) {
    const subtypes = byType.get(resource.type) ?? new Map()
    subtypes.set(
      resource.subtype,
      (subtypes.get(resource.subtype) ?? 0) + resource.amount,
    )
    byType.set(resource.type, subtypes)
  }

  return [...byType.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([type, subtypes]) => ({
      type,
      subtypes: [...subtypes.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([subtype, total]) => ({ subtype, total })),
    }))
})
</script>

<template>
  <section class="dash-widget dash-resources-widget">
    <button
      type="button"
      class="dash-widget-title"
      @click="nav.openTopic('resources')"
    >
      Resources
    </button>
    <template v-if="typeGroups.length > 0">
      <div
        v-for="group in typeGroups"
        :key="group.type"
        class="dash-resource-group"
      >
        <h4 class="dash-resource-type">{{ resourceTypeLabel(group.type) }}</h4>
        <ul class="dash-resource-grid">
          <li
            v-for="entry in group.subtypes"
            :key="entry.subtype"
          >
            <span>{{ resourceSubtypeLabel(entry.subtype) }}</span>
            <span class="dash-amount">{{ entry.total }}</span>
          </li>
        </ul>
      </div>
    </template>
    <p v-else class="dash-empty">—</p>
  </section>
</template>
