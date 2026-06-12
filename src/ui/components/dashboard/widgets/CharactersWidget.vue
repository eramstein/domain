<script setup lang="ts">
import { useGameState } from '@state/useGameState'
import { useDashboardLookups } from '@ui/composables/useDashboardLookups'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'

const nav = useDashboardNavigation()
const gameState = useGameState()
const { placeName } = useDashboardLookups()
</script>

<template>
  <section class="dash-widget">
    <button
      type="button"
      class="dash-widget-title"
      @click="nav.openTopic('characters')"
    >
      Characters
    </button>
    <ul class="dash-list">
      <li v-for="character in gameState.characters" :key="character.id">
        <span>
          <button
            type="button"
            class="dash-link"
            @click="nav.openCharacter(character.id)"
          >
            {{ character.name }}
          </button>
          <span v-if="character.isPlayer" class="dash-tag">you</span>
        </span>
        <span class="dash-meta">{{ placeName(character.placeId) }}</span>
      </li>
      <li v-if="gameState.characters.length === 0" class="dash-empty">—</li>
    </ul>
  </section>
</template>
