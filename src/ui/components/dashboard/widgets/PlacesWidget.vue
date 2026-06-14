<script setup lang="ts">
import RegionImage from '../RegionImage.vue'
import { useDashboardLookups } from '@ui/composables/useDashboardLookups'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'

const nav = useDashboardNavigation()
const { regionsWithPlaces } = useDashboardLookups()
</script>

<template>
  <section class="dash-widget">
    <button
      type="button"
      class="dash-widget-title"
      @click="nav.openTopic('places')"
    >
      Places
    </button>
    <ul v-if="regionsWithPlaces.length > 0" class="dash-list dash-region-list">
      <li
        v-for="{ region, places } in regionsWithPlaces"
        :key="region.id"
        class="dash-region-group"
      >
        <span class="dash-region-name">{{ region.name }}</span>
        <RegionImage :region-id="region.id" :alt="region.name" />
        <ul class="dash-list dash-place-list">
          <li v-for="place in places" :key="place.id" class="dash-place-entry">
            <button
              type="button"
              class="dash-link"
              @click="nav.openPlace(place.id)"
            >
              {{ place.name }}
            </button>
          </li>
          <li v-if="places.length === 0" class="dash-empty">—</li>
        </ul>
      </li>
    </ul>
    <p v-else class="dash-empty">—</p>
  </section>
</template>
