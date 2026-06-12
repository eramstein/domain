<script setup lang="ts">
export interface BreadcrumbSegment {
  label: string
  onClick?: () => void
}

defineProps<{
  segments: readonly BreadcrumbSegment[]
}>()
</script>

<template>
  <nav class="dash-breadcrumbs" aria-label="Dashboard">
    <template v-for="(segment, index) in segments" :key="index">
      <span v-if="index > 0" class="dash-breadcrumb-sep" aria-hidden="true"
        >/</span
      >
      <button
        v-if="segment.onClick"
        type="button"
        class="dash-breadcrumb-link"
        @click="segment.onClick"
      >
        {{ segment.label }}
      </button>
      <span v-else class="dash-breadcrumb-current">{{ segment.label }}</span>
    </template>
  </nav>
</template>
