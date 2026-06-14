<script setup lang="ts">
import PlaceImage from '../PlaceImage.vue'
import { useDashboardLookups } from '@ui/composables/useDashboardLookups'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'
import { usePlayerActions } from '@ui/composables/usePlayerActions'

const nav = useDashboardNavigation()
const { player, executeResolvedAction } = usePlayerActions()
const {
  regionsWithPlaces,
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
          <PlaceImage :place-id="place.id" :alt="place.name" />
          <div class="place-details">
            <button
              type="button"
              class="dash-link place-name"
              @click="nav.openPlace(place.id)"
            >
              {{ place.name }}
            </button>
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
            <p
              v-if="charactersAtPlace(place.id).length > 0"
              class="place-present"
            >
              <span class="place-present-label">Present</span>
              <span class="place-present-names">
                <button
                  v-for="character in charactersAtPlace(place.id)"
                  :key="character.id"
                  type="button"
                  class="dash-link"
                  @click="nav.openCharacter(character.id)"
                >
                  {{ character.name }}
                </button>
              </span>
            </p>
          </div>
        </li>
        <li v-if="places.length === 0" class="dash-empty">—</li>
      </ul>
    </li>
  </ul>
  <p v-else class="dash-empty">—</p>
</template>

<style scoped>
.dash-place-item + .dash-place-item {
  margin-top: 1.25rem;
  padding-top: 1.25rem;
  border-top: 1px solid var(--dash-border);
}

.place-details {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.place-name {
  color: var(--text);
}

.place-present {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem 0.5rem;
  margin: 0;
  color: var(--text-muted);
}

.place-present-label {
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.place-present-names {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0 0.15rem;
}

.place-present-names .dash-link:not(:last-child)::after {
  content: ',';
}
</style>
