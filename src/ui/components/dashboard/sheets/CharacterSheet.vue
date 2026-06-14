<script setup lang="ts">
import { computed } from 'vue'

import { useDashboardLookups } from '@ui/composables/useDashboardLookups'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'

const props = defineProps<{
  characterId: string
}>()

const nav = useDashboardNavigation()
const { characterById, placeName } = useDashboardLookups()

const character = computed(() => characterById.value.get(props.characterId))

const personalityTraits = computed(
  () => character.value?.personalityTraits ?? [],
)

const attributes = computed(() => character.value?.attributes)

const longActionUsed = computed(
  () => character.value?.turnBudget?.longActionUsed ?? false,
)
</script>

<template>
  <div v-if="character" class="character-sheet">
    <section class="dash-sheet-section">
      <h3>Identity</h3>
      <p class="dash-name">{{ character.name }}</p>
      <p v-if="character.isPlayer" class="dash-tag">Player character</p>
      <p v-else-if="character.npcType" class="dash-tag">
        {{ character.npcType }}
      </p>
    </section>

    <section v-if="character.portrait" class="dash-sheet-section">
      <h3>Portrait</h3>
      <p class="portrait-ref">{{ character.portrait }}</p>
    </section>

    <section class="dash-sheet-section">
      <h3>Appearance</h3>
      <p>{{ character.physicalDescription }}</p>
    </section>

    <section class="dash-sheet-section">
      <h3>Personality</h3>
      <p>{{ character.personalityDescription }}</p>
      <ul v-if="personalityTraits.length > 0" class="dash-trait-list">
        <li v-for="trait in personalityTraits" :key="trait">
          {{ trait }}
        </li>
      </ul>
    </section>

    <section v-if="attributes" class="dash-sheet-section">
      <h3>Attributes</h3>
      <dl class="dash-stat-grid">
        <dt>Strength</dt>
        <dd>{{ attributes.strength }}</dd>
        <dt>Vitality</dt>
        <dd>{{ attributes.vitality }}</dd>
        <dt>Intelligence</dt>
        <dd>{{ attributes.intelligence }}</dd>
      </dl>
    </section>

    <section class="dash-sheet-section">
      <h3>Status</h3>
      <dl class="dash-stat-grid">
        <dt>Health</dt>
        <dd>{{ character.health }}</dd>
        <dt>Location</dt>
        <dd>
          <button
            type="button"
            class="dash-link"
            @click="nav.openPlace(character.placeId)"
          >
            {{ placeName(character.placeId) }}
          </button>
        </dd>
        <dt>Long action</dt>
        <dd>{{ longActionUsed ? 'used' : 'available' }}</dd>
      </dl>
    </section>
  </div>
  <p v-else class="dash-empty">Character not found.</p>
</template>

<style scoped>
.portrait-ref {
  color: var(--text-muted);
}
</style>
