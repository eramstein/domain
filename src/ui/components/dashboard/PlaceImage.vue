<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  placeId: string
  alt: string
}>()

const hidden = ref(false)

const source = computed(() => `/assets/images/places/${props.placeId}.jpg`)

function onError(): void {
  hidden.value = true
}

watch(
  () => props.placeId,
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
    class="dash-place-image"
    @error="onError"
  />
</template>
