<script setup lang="ts">
import { useDashboardLookups } from '@ui/composables/useDashboardLookups'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'
import { usePlayerActions } from '@ui/composables/usePlayerActions'

const nav = useDashboardNavigation()
const { player, executeResolvedAction } = usePlayerActions()
const {
  regionsWithPlaces,
  regionName,
  resourceName,
  charactersAtPlace,
} = useDashboardLookups()

function collectResource(placeId: string, resourceId: string): void {
  executeResolvedAction({
    actionId: 'collect-resource',
    parameters: { placeId, resourceId },
  })
}
</script>

<template>
  <ul v-if="regionsWithPlaces.length > 0" class="dash-list dash-region-list">
    <li
      v-for="{ region, places } in regionsWithPlaces"
      :key="region.id"
      class="dash-region-group"
    >
      <span class="dash-region-name">{{ region.name }}</span>
      <ul class="dash-list dash-place-list">
        <li v-for="place in places" :key="place.id" class="dash-place-item">
          <div class="place-row">
            <button
              type="button"
              class="dash-link"
              @click="nav.openPlace(place.id)"
            >
              {{ place.name }}
            </button>
            <span class="dash-meta">{{ regionName(place.regionId) }}</span>
          </div>
          <ul
            v-if="place.naturalResources.length > 0"
            class="dash-list dash-sublist"
          >
            <li
              v-for="naturalResource in place.naturalResources"
              :key="naturalResource.resourceId"
            >
              <button
                type="button"
                class="dash-link"
                :disabled="!player"
                @click="
                  collectResource(place.id, naturalResource.resourceId)
                "
              >
                {{ resourceName(naturalResource.resourceId) }}
              </button>
              <span class="dash-amount">{{ naturalResource.abundance }}</span>
            </li>
          </ul>
          <p v-if="charactersAtPlace(place.id).length > 0" class="present">
            <button
              v-for="character in charactersAtPlace(place.id)"
              :key="character.id"
              type="button"
              class="dash-link present-name"
              @click="nav.openCharacter(character.id)"
            >
              {{ character.name }}
            </button>
          </p>
        </li>
        <li v-if="places.length === 0" class="dash-empty">—</li>
      </ul>
    </li>
  </ul>
  <p v-else class="dash-empty">—</p>
</template>

<style scoped>
.place-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.present {
  margin: 0.25rem 0 0 0.75rem;
  font-size: 0.8rem;
}

.present-name {
  font-weight: 400;
  font-size: 0.8rem;
}

.present-name:not(:last-child)::after {
  content: ', ';
}
</style>
