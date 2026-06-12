<script setup lang="ts">
defineProps<{
  timeString: string
  period: string
}>()
</script>

<template>
  <section class="dash-widget">
    <h3 class="dash-widget-label">Time</h3>
    <p class="time-date">{{ timeString }}</p>
    <p class="time-period">{{ period }}</p>
  </section>
</template>

<style scoped>
.dash-widget-label {
  margin: 0 0 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
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
