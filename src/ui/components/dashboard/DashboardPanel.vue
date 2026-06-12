<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { engineGetTimeString } from '@engine/index'
import { useGameState } from '@state/useGameState'
import {
  type DashboardTopic,
  useDashboardNavigation,
} from '@ui/stores/dashboardNavigation'

import DashboardBreadcrumbs, {
  type BreadcrumbSegment,
} from './DashboardBreadcrumbs.vue'
import CharacterSheet from './sheets/CharacterSheet.vue'
import PlaceSheet from './sheets/PlaceSheet.vue'
import CharactersTopic from './topics/CharactersTopic.vue'
import PlacesTopic from './topics/PlacesTopic.vue'
import ResourcesTopic from './topics/ResourcesTopic.vue'
import CharactersWidget from './widgets/CharactersWidget.vue'
import PlacesWidget from './widgets/PlacesWidget.vue'
import ResourcesWidget from './widgets/ResourcesWidget.vue'
import TimeWidget from './widgets/TimeWidget.vue'

import '@ui/styles/dashboard.css'

const nav = useDashboardNavigation()
const { view } = storeToRefs(nav)
const gameState = useGameState()

const timeString = computed(() => engineGetTimeString())

const topicLabels: Record<DashboardTopic, string> = {
  resources: 'Resources',
  characters: 'Characters',
  places: 'Places',
}

const breadcrumbs = computed((): BreadcrumbSegment[] => {
  const segments: BreadcrumbSegment[] = [
    { label: 'Domain', onClick: () => nav.goHome() },
  ]

  const current = view.value

  if (current.kind === 'home') {
    segments[0] = { label: 'Domain' }
    return segments
  }

  if (current.kind === 'topic') {
    segments.push({ label: topicLabels[current.topic] })
    return segments
  }

  if (current.kind === 'character') {
    const character = gameState.characters.find(
      (entry) => entry.id === current.characterId,
    )
    segments.push({
      label: 'Characters',
      onClick: () => nav.openTopic('characters'),
    })
    segments.push({ label: character?.name ?? '—' })
    return segments
  }

  const place = gameState.places.find((entry) => entry.id === current.placeId)
  segments.push({
    label: 'Places',
    onClick: () => nav.openTopic('places'),
  })
  segments.push({ label: place?.name ?? '—' })
  return segments
})
</script>

<template>
  <section class="dash-panel">
    <h2 class="dash-heading">Domain</h2>
    <DashboardBreadcrumbs :segments="breadcrumbs" />

    <template v-if="view.kind === 'home'">
      <TimeWidget
        :time-string="timeString"
        :period="gameState.time.period"
      />
      <ResourcesWidget />
      <CharactersWidget />
      <PlacesWidget />
    </template>

    <ResourcesTopic v-else-if="view.kind === 'topic' && view.topic === 'resources'" />
    <CharactersTopic v-else-if="view.kind === 'topic' && view.topic === 'characters'" />
    <PlacesTopic v-else-if="view.kind === 'topic' && view.topic === 'places'" />

    <CharacterSheet
      v-else-if="view.kind === 'character'"
      :character-id="view.characterId"
    />
    <PlaceSheet
      v-else-if="view.kind === 'place'"
      :place-id="view.placeId"
    />
  </section>
</template>
