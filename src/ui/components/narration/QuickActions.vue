<script setup lang="ts">
import { usePlayerActions } from '@ui/composables/usePlayerActions'
import type { ResolvedAction } from '@/types'

import ActionPicker from './ActionPicker.vue'

const { player, executeResolvedAction, clearFeedback } = usePlayerActions()

function onComplete(resolved: ResolvedAction): void {
  executeResolvedAction(resolved)
}

function onStart(): void {
  clearFeedback()
}
</script>

<template>
  <ActionPicker
    label="Quick actions"
    :disabled="!player"
    @complete="onComplete"
    @start="onStart"
  />
</template>
