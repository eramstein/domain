import { computed, ref } from 'vue'

import { engineExecuteAction } from '@engine/index'
import { useGameState } from '@state/useGameState'
import type { ResolvedAction } from '@/types'

const feedback = ref<string | null>(null)

export function usePlayerActions() {
  const gameState = useGameState()

  const player = computed(() =>
    gameState.characters.find((character) => character.isPlayer),
  )

  const longActionUsed = computed(
    () => player.value?.turnBudget.longActionUsed ?? false,
  )

  function executeResolvedAction(resolved: ResolvedAction): boolean {
    if (!player.value) return false

    feedback.value = null
    const result = engineExecuteAction(player.value.id, resolved)
    if (!result.success) {
      feedback.value =
        result.message ?? "You can't do that right now."
      return false
    }

    return true
  }

  function clearFeedback(): void {
    feedback.value = null
  }

  return {
    player,
    longActionUsed,
    feedback,
    executeResolvedAction,
    clearFeedback,
  }
}
