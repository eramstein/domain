<script setup lang="ts">
import type { PickerOption } from '@ui/composables/useActionPickerOptions'

defineProps<{
  label: string
  options: readonly PickerOption[]
  disabled?: boolean
}>()

const emit = defineEmits<{
  select: [id: string]
  cancel: []
}>()
</script>

<template>
  <div class="entity-picker">
    <p class="picker-label">{{ label }}</p>
    <ul v-if="options.length > 0" class="picker-list">
      <li v-for="option in options" :key="option.id">
        <button
          type="button"
          class="picker-option"
          :disabled="disabled"
          @click="emit('select', option.id)"
        >
          <span class="picker-option-label">{{ option.label }}</span>
          <span v-if="option.hint" class="picker-option-hint">{{
            option.hint
          }}</span>
        </button>
      </li>
    </ul>
    <p v-else class="picker-empty">No options available.</p>
    <button type="button" class="picker-cancel" @click="emit('cancel')">
      Cancel
    </button>
  </div>
</template>

<style scoped>
.entity-picker {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem 0 0;
  border-top: 1px solid var(--text-muted);
}

.picker-label {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.picker-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.picker-list li {
  padding: 0.15rem 0;
}

.picker-option {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  margin: 0;
  padding: 0.35rem 0;
  border: none;
  background: none;
  color: var(--text);
  font: inherit;
  font-size: 0.95rem;
  text-align: left;
  cursor: pointer;
}

.picker-option:hover:not(:disabled) {
  text-decoration: underline;
}

.picker-option:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.picker-option-label {
  font-weight: 500;
}

.picker-option-hint {
  color: var(--text-muted);
  flex-shrink: 0;
}

.picker-empty {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-muted);
  font-style: italic;
}

.picker-cancel {
  align-self: flex-start;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: var(--text-muted);
  font: inherit;
  font-size: 0.85rem;
  cursor: pointer;
}

.picker-cancel:hover {
  color: var(--text);
  text-decoration: underline;
}
</style>
