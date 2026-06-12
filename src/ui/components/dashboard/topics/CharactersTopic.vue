<script setup lang="ts">
import { useGameState } from '@state/useGameState'
import { useDashboardLookups } from '@ui/composables/useDashboardLookups'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'

const nav = useDashboardNavigation()
const gameState = useGameState()
const { placeName } = useDashboardLookups()
</script>

<template>
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
        <span v-if="character.isPlayer" class="dash-tag"> you</span>
        <span v-else-if="character.npcType" class="dash-tag">
          {{ character.npcType }}
        </span>
      </span>
      <span class="dash-meta">
        <span>{{ placeName(character.placeId) }}</span>
        <span>{{ character.health }}</span>
      </span>
    </li>
    <li v-if="gameState.characters.length === 0" class="dash-empty">—</li>
  </ul>
</template>

<style scoped>
.dash-meta {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}
</style>
