<script setup lang="ts">
import type { NarrationEntry } from '@/types'

defineProps<{
  entries: readonly NarrationEntry[]
}>()
</script>

<template>
  <section class="narration-panel">
    <h2 class="heading">Narration</h2>
    <div class="entries">
      <p v-for="entry in entries" :key="entry.id" class="entry">
        {{ entry.text }}
      </p>
      <p v-if="entries.length === 0" class="empty">No events yet.</p>
    </div>
  </section>
</template>

<style scoped>
.narration-panel {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.heading {
  margin: 0 0 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.entries {
  flex: 1;
  overflow-y: auto;
}

.entry {
  margin: 0 0 1.25rem;
  line-height: 1.7;
  font-size: 1.05rem;
}

.empty {
  margin: 0;
  color: var(--text-muted);
  font-style: italic;
}
</style>
