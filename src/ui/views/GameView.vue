<script setup lang="ts">
import { enginePassTurn } from '@engine/index'
import { useGameState } from '@state/useGameState'

import DashboardPanel from '../components/dashboard/DashboardPanel.vue'
import ActionPanel from '../components/narration/ActionPanel.vue'
import NarrationPanel from '../components/narration/NarrationPanel.vue'

const gameState = useGameState()

function passTurn(): void {
  enginePassTurn()
}
</script>

<template>
  <div class="game-view">
    <div class="main-column">
      <NarrationPanel :entries="gameState.narration" />
      <ActionPanel />
      <button type="button" class="pass-turn" @click="passTurn">
        End turn
      </button>
    </div>
    <DashboardPanel />
  </div>
</template>

<style scoped>
.game-view {
  display: grid;
  grid-template-columns: 1fr 16rem;
  gap: 3rem;
  max-width: 56rem;
  margin: 0 auto;
  padding: 2.5rem 1.5rem;
  min-height: 100vh;
}

.main-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  min-height: 0;
}

.pass-turn {
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

.pass-turn:hover {
  border-color: var(--text);
  background: rgba(26, 24, 22, 0.04);
}

@media (max-width: 640px) {
  .game-view {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
}
</style>
