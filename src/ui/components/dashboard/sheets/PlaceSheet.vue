<script setup lang="ts">
import { computed } from 'vue'

import PlaceImage from '../PlaceImage.vue'
import { useDashboardLookups } from '@ui/composables/useDashboardLookups'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'
import { usePlayerActions } from '@ui/composables/usePlayerActions'

const props = defineProps<{
  placeId: string
}>()

const nav = useDashboardNavigation()
const { player, executeResolvedAction } = usePlayerActions()
const {
  placeById,
  regionName,
  resourceName,
  charactersAtPlace,
} = useDashboardLookups()

const place = computed(() => placeById.value.get(props.placeId))
const presentCharacters = computed(() => charactersAtPlace(props.placeId))

function goToPlace(): void {
  if (!place.value) return
  executeResolvedAction({
    actionId: 'goto',
    parameters: { placeId: place.value.id },
  })
}

function collectResource(resourceId: string): void {
  if (!place.value) return
  executeResolvedAction({
    actionId: 'collect-resource',
    parameters: { placeId: place.value.id, resourceId },
  })
}
</script>

<template>
  <div v-if="place" class="place-sheet">
    <section class="dash-sheet-section">
      <PlaceImage :place-id="place.id" :alt="place.name" />
      <h3>Location</h3>
      <p class="dash-name">{{ place.name }}</p>
      <p class="dash-meta" style="text-align: left">
        {{ regionName(place.regionId) }}
      </p>
      <button
        v-if="player"
        type="button"
        class="dash-link goto"
        @click="goToPlace"
      >
        Go here
      </button>
    </section>

    <section
      v-if="place.naturalResources.length > 0"
      class="dash-sheet-section"
    >
      <h3>Natural resources</h3>
      <ul class="dash-list">
        <li
          v-for="naturalResource in place.naturalResources"
          :key="naturalResource.resourceId"
        >
          <button
            type="button"
            class="dash-link"
            :disabled="!player"
            @click="collectResource(naturalResource.resourceId)"
          >
            {{ resourceName(naturalResource.resourceId) }}
          </button>
          <span class="dash-amount">{{ naturalResource.abundance }}</span>
        </li>
      </ul>
    </section>

    <section class="dash-sheet-section">
      <h3>Characters present</h3>
      <ul v-if="presentCharacters.length > 0" class="dash-list">
        <li v-for="character in presentCharacters" :key="character.id">
          <button
            type="button"
            class="dash-link"
            @click="nav.openCharacter(character.id)"
          >
            {{ character.name }}
          </button>
        </li>
      </ul>
      <p v-else class="dash-empty">—</p>
    </section>
  </div>
  <p v-else class="dash-empty">Place not found.</p>
</template>

<style scoped>
.goto {
  margin-top: 0.5rem;
}
</style>
