<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

import {
  engineInitializeGame,
  engineLoadGame,
  engineSaveGame,
  QUICKSAVE_NAME,
} from '@engine/index'

import GameView from './views/GameView.vue'

function onKeyDown(event: KeyboardEvent): void {
  if (event.key === 'F5') {
    event.preventDefault()
    void engineSaveGame(QUICKSAVE_NAME)
    return
  }

  if (event.key === 'F4') {
    event.preventDefault()
    void engineLoadGame(QUICKSAVE_NAME)
    return
  }

  if (event.key === 'F6') {
    event.preventDefault()
    if (window.confirm('Reset game state? Unsaved progress will be lost.')) {
      engineInitializeGame()
    }
  }
}

onMounted(() => window.addEventListener('keydown', onKeyDown))
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<template>
  <GameView />
</template>
