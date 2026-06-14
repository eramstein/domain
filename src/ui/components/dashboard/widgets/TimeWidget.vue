<script setup lang="ts">
defineProps<{
  period: string
  date: string
}>()
</script>

<template>
  <p class="dash-time-label">
    <span class="dash-time-period">{{ period }}</span>
    <span class="dash-time-sep"> - </span>
    <span class="dash-time-date">{{ date }}</span>
  </p>
</template>
