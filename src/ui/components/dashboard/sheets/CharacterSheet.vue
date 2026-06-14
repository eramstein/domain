<script setup lang="ts">
import { computed } from 'vue'

import ActionPicker from '@ui/components/narration/ActionPicker.vue'
import { formatResolvedActionLabel } from '@ui/composables/formatResolvedActionLabel'
import { useDashboardLookups } from '@ui/composables/useDashboardLookups'
import { useNpcOrders } from '@ui/composables/useNpcOrders'
import { useDashboardNavigation } from '@ui/stores/dashboardNavigation'
import type { ResolvedAction } from '@/types'

const props = defineProps<{
  characterId: string
}>()

const nav = useDashboardNavigation()
const { characterById, placeName, resourceName } = useDashboardLookups()
const { feedback: orderFeedback, setOrder, cancelOrder, clearFeedback } =
  useNpcOrders()

const character = computed(() => characterById.value.get(props.characterId))

const personalityTraits = computed(
  () => character.value?.personalityTraits ?? [],
)

const attributes = computed(() => character.value?.attributes)

const longActionUsed = computed(
  () => character.value?.turnBudget?.longActionUsed ?? false,
)

const isAlly = computed(() => character.value?.npcType === 'ally')

const hasPendingOrder = computed(() => character.value?.order != null)

const currentOrderLabel = computed(() => {
  const order = character.value?.order
  if (!order) return null
  return formatResolvedActionLabel(order, placeName, resourceName)
})

function giveOrder(resolved: ResolvedAction): void {
  setOrder(props.characterId, resolved)
}

function clearOrder(): void {
  cancelOrder(props.characterId)
}
</script>

<template>
  <div v-if="character" class="character-sheet">
    <section class="dash-sheet-section">
      <h3>Identity</h3>
      <p class="dash-name">{{ character.name }}</p>
      <p v-if="character.isPlayer" class="dash-tag">Player character</p>
      <p v-else-if="character.npcType" class="dash-tag">
        {{ character.npcType }}
      </p>
      <p class="character-place">
        <button
          type="button"
          class="dash-link"
          @click="nav.openPlace(character.placeId)"
        >
          {{ placeName(character.placeId) }}
        </button>
      </p>
    </section>

    <section v-if="character.portrait" class="dash-sheet-section">
      <h3>Portrait</h3>
      <p class="portrait-ref">{{ character.portrait }}</p>
    </section>

    <section v-if="isAlly" class="dash-sheet-section">
      <div v-if="hasPendingOrder" class="order-pending">
        <p class="order-pending-text">
          Pending: {{ currentOrderLabel }}
        </p>
        <button type="button" class="dash-link" @click="clearOrder">
          Cancel
        </button>
      </div>
      <template v-else>
        <p v-if="orderFeedback" class="order-feedback">{{ orderFeedback }}</p>
        <ActionPicker
          label="Give order"
          @complete="giveOrder"
          @start="clearFeedback"
        />
      </template>
    </section>

    <section class="dash-sheet-section">
      <h3>Appearance</h3>
      <p>{{ character.physicalDescription }}</p>
    </section>

    <section class="dash-sheet-section">
      <h3>Personality</h3>
      <p>{{ character.personalityDescription }}</p>
      <ul v-if="personalityTraits.length > 0" class="dash-trait-list">
        <li v-for="trait in personalityTraits" :key="trait">
          {{ trait }}
        </li>
      </ul>
    </section>

    <section v-if="attributes" class="dash-sheet-section">
      <h3>Attributes</h3>
      <dl class="dash-stat-grid">
        <dt>Strength</dt>
        <dd>{{ attributes.strength }}</dd>
        <dt>Vitality</dt>
        <dd>{{ attributes.vitality }}</dd>
        <dt>Intelligence</dt>
        <dd>{{ attributes.intelligence }}</dd>
      </dl>
    </section>

    <section class="dash-sheet-section">
      <h3>Status</h3>
      <dl class="dash-stat-grid">
        <dt>Health</dt>
        <dd>{{ character.health }}</dd>
        <dt>Long action</dt>
        <dd>{{ longActionUsed ? 'used' : 'available' }}</dd>
      </dl>
    </section>
  </div>
  <p v-else class="dash-empty">Character not found.</p>
</template>

<style scoped>
.character-place {
  margin: 0.35rem 0 0;
}

.portrait-ref {
  color: var(--text-muted);
}

.order-pending {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.order-pending-text {
  margin: 0;
  color: var(--text-muted);
}

.order-feedback {
  margin: 0 0 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>
