<script setup lang="ts">
import { computed, ref } from 'vue'

import { actionSeeds } from '@data/index'
import { useActionPickerOptions } from '@ui/composables/useActionPickerOptions'
import { usePlayerActions } from '@ui/composables/usePlayerActions'
import type { ActionSeed } from '@/types'

import EntityPicker from './EntityPicker.vue'

const { player, executeResolvedAction, clearFeedback } = usePlayerActions()
const { getOptionsForParameter } = useActionPickerOptions()

const activeActionId = ref<string | null>(null)
const parameterIndex = ref(0)
const collectedParams = ref<Record<string, string>>({})

const activeDefinition = computed((): ActionSeed | undefined =>
  activeActionId.value
    ? actionSeeds.find((action) => action.id === activeActionId.value)
    : undefined,
)

const currentParameter = computed(
  () => activeDefinition.value?.parameters[parameterIndex.value],
)

const currentOptions = computed(() => {
  if (!activeDefinition.value || !currentParameter.value) return []
  return getOptionsForParameter(
    activeDefinition.value.id,
    currentParameter.value,
    collectedParams.value,
  )
})

const pickerLabel = computed(() => {
  const parameter = currentParameter.value
  if (!parameter) return ''

  if (parameter.name === 'placeId') return 'Choose a place'
  if (parameter.name === 'resourceId') return 'Choose a resource'
  return parameter.description
})

function isActive(actionId: string): boolean {
  return activeActionId.value === actionId
}

function startAction(actionId: string): void {
  if (!player.value) return

  if (activeActionId.value === actionId) {
    cancel()
    return
  }

  clearFeedback()
  activeActionId.value = actionId
  parameterIndex.value = 0
  collectedParams.value = {}
}

function selectOption(id: string): void {
  const definition = activeDefinition.value
  const parameter = currentParameter.value
  if (!definition || !parameter || !player.value) return

  collectedParams.value = { ...collectedParams.value, [parameter.name]: id }
  parameterIndex.value += 1

  if (parameterIndex.value >= definition.parameters.length) {
    executeResolvedAction({
      actionId: definition.id,
      parameters: { ...collectedParams.value },
    })
    cancel()
  }
}

function cancel(): void {
  activeActionId.value = null
  parameterIndex.value = 0
  collectedParams.value = {}
}
</script>

<template>
  <div class="quick-actions">
    <p class="quick-actions-label">Quick actions</p>
    <div class="quick-actions-buttons">
      <button
        v-for="action in actionSeeds"
        :key="action.id"
        type="button"
        class="quick-action-button"
        :class="{ active: isActive(action.id) }"
        :disabled="!player"
        @click="startAction(action.id)"
      >
        {{ action.name }}
      </button>
    </div>

    <EntityPicker
      v-if="activeDefinition && currentParameter"
      :label="pickerLabel"
      :options="currentOptions"
      :disabled="!player"
      @select="selectOption"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped>
.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.quick-actions-label {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.quick-actions-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.quick-action-button {
  margin: 0;
  padding: 0.45rem 0.9rem;
  border: 1px solid var(--text-muted);
  border-radius: 2px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.quick-action-button:hover:not(:disabled) {
  border-color: var(--text);
  background: rgba(26, 24, 22, 0.04);
}

.quick-action-button.active {
  border-color: var(--text);
  background: rgba(26, 24, 22, 0.06);
}

.quick-action-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
