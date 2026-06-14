<script setup lang="ts">
import { computed, ref } from 'vue'

import { actionSeeds } from '@data/index'
import { useActionPickerOptions } from '@ui/composables/useActionPickerOptions'
import type { ActionSeed, ResolvedAction } from '@/types'

import EntityPicker from './EntityPicker.vue'

const props = withDefaults(
  defineProps<{
    label?: string
    disabled?: boolean
  }>(),
  {
    label: 'Quick actions',
    disabled: false,
  },
)

const emit = defineEmits<{
  complete: [resolved: ResolvedAction]
  start: []
}>()

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
  if (props.disabled) return

  if (activeActionId.value === actionId) {
    cancel()
    return
  }

  emit('start')
  activeActionId.value = actionId
  parameterIndex.value = 0
  collectedParams.value = {}
}

function selectOption(id: string): void {
  const definition = activeDefinition.value
  const parameter = currentParameter.value
  if (!definition || !parameter || props.disabled) return

  collectedParams.value = { ...collectedParams.value, [parameter.name]: id }
  parameterIndex.value += 1

  if (parameterIndex.value >= definition.parameters.length) {
    emit('complete', {
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
  <div class="action-picker">
    <p class="action-picker-label">{{ label }}</p>
    <div class="action-picker-buttons">
      <button
        v-for="action in actionSeeds"
        :key="action.id"
        type="button"
        class="action-picker-button"
        :class="{ active: isActive(action.id) }"
        :disabled="disabled"
        @click="startAction(action.id)"
      >
        {{ action.name }}
      </button>
    </div>

    <EntityPicker
      v-if="activeDefinition && currentParameter"
      :label="pickerLabel"
      :options="currentOptions"
      :disabled="disabled"
      @select="selectOption"
      @cancel="cancel"
    />
  </div>
</template>

<style scoped>
.action-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.action-picker-label {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.action-picker-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.action-picker-button {
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

.action-picker-button:hover:not(:disabled) {
  border-color: var(--text);
  background: rgba(26, 24, 22, 0.04);
}

.action-picker-button.active {
  border-color: var(--text);
  background: rgba(26, 24, 22, 0.06);
}

.action-picker-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
