<script setup lang="ts">
import { ref } from 'vue'

import { engineFindActionsInText } from '@engine/index'
import { usePlayerActions } from '@ui/composables/usePlayerActions'

import QuickActions from './QuickActions.vue'

const actionText = ref('')
const isResolving = ref(false)

const { player, longActionUsed, feedback, executeResolvedAction, clearFeedback } =
  usePlayerActions()

async function submitAction(): Promise<void> {
  const text = actionText.value.trim()
  if (!text || !player.value || isResolving.value) return

  isResolving.value = true
  clearFeedback()

  try {
    const resolved = await engineFindActionsInText(player.value.id, text)
    if (resolved.length === 0) {
      feedback.value = "I couldn't figure out what you want to do."
      return
    }

    for (const action of resolved) {
      if (!executeResolvedAction(action)) {
        return
      }
    }

    actionText.value = ''
  } finally {
    isResolving.value = false
  }
}
</script>

<template>
  <section class="action-panel">
    <h2 class="heading">What do you do?</h2>
    <form class="action-form" @submit.prevent="submitAction">
      <textarea
        v-model="actionText"
        class="action-input"
        rows="3"
        placeholder="I go to the kitchen…"
        :disabled="isResolving || !player"
        @keydown.enter.exact.prevent="submitAction"
      />
      <button
        type="submit"
        class="submit-action"
        :disabled="isResolving || !actionText.trim() || !player"
      >
        {{ isResolving ? 'Thinking…' : 'Act' }}
      </button>
    </form>
    <p v-if="longActionUsed" class="budget-note">Long action used this turn.</p>
    <p v-if="feedback" class="feedback">{{ feedback }}</p>
    <QuickActions />
  </section>
</template>

<style scoped>
.action-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.heading {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.action-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--text-muted);
  border-radius: 2px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 1rem;
  line-height: 1.5;
  resize: vertical;
}

.action-input:focus {
  outline: none;
  border-color: var(--text);
}

.submit-action {
  align-self: flex-start;
  margin: 0;
  padding: 0.6rem 1.25rem;
  border: 1px solid var(--text-muted);
  border-radius: 2px;
  background: transparent;
  color: var(--text);
  font: inherit;
  font-size: 0.9rem;
  letter-spacing: 0.02em;
  cursor: pointer;
}

.submit-action:hover:not(:disabled) {
  border-color: var(--text);
  background: rgba(26, 24, 22, 0.04);
}

.submit-action:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.budget-note {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.feedback {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
}
</style>
