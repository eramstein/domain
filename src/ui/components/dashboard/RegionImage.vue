<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  regionId: string
  alt: string
}>()

const hidden = ref(false)

const source = computed(() => `/assets/images/regions/${props.regionId}.jpg`)

function onError(): void {
  hidden.value = true
}

watch(
  () => props.regionId,
  () => {
    hidden.value = false
  },
)
</script>

<template>
  <img
    v-if="!hidden"
    :src="source"
    :alt="alt"
    class="dash-region-image"
    @error="onError"
  />
</template>
