<script setup lang="ts">
import type { Character, GameTime, Place, Resource } from '@/types'

defineProps<{
  time: GameTime
  timeString: string
  characters: readonly Character[]
  places: readonly Place[]
  resources: readonly Resource[]
}>()
</script>

<template>
  <section class="state-explorer">
    <h2 class="heading">Domain</h2>

    <div class="section">
      <h3>Time</h3>
      <p class="time-date">{{ timeString }}</p>
      <p class="time-period">{{ time.period }}</p>
    </div>

    <div class="section">
      <h3>Characters</h3>
      <ul>
        <li v-for="character in characters" :key="character.id">
          <span class="name">{{ character.name }}</span>
          <span v-if="character.isPlayer" class="tag">you</span>
        </li>
        <li v-if="characters.length === 0" class="empty">—</li>
      </ul>
    </div>

    <div class="section">
      <h3>Places</h3>
      <ul>
        <li v-for="place in places" :key="place.id">
          {{ place.name }}
        </li>
        <li v-if="places.length === 0" class="empty">—</li>
      </ul>
    </div>

    <div class="section">
      <h3>Resources</h3>
      <ul>
        <li v-for="resource in resources" :key="resource.id">
          <span class="name">{{ resource.name }}</span>
          <span class="amount">{{ resource.amount }}</span>
        </li>
        <li v-if="resources.length === 0" class="empty">—</li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.state-explorer {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.heading {
  margin: 0 0 1.25rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.section {
  margin-bottom: 1.5rem;
}

.section h3 {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-muted);
}

ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.35rem 0;
  font-size: 0.95rem;
}

.name {
  font-weight: 500;
}

.amount {
  font-variant-numeric: tabular-nums;
  color: var(--text-muted);
}

.tag {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.empty {
  color: var(--text-muted);
}

.time-date {
  margin: 0 0 0.25rem;
  font-size: 0.95rem;
  font-weight: 500;
}

.time-period {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}
</style>
