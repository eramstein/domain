import { ref } from 'vue'

import { engineClearNpcOrder, engineSetNpcOrder } from '@engine/index'
import type { ResolvedAction } from '@/types'

const feedback = ref<string | null>(null)

export function useNpcOrders() {
  function setOrder(
    characterId: string,
    resolved: ResolvedAction,
  ): boolean {
    feedback.value = null
    const result = engineSetNpcOrder(characterId, resolved)
    if (!result.success) {
      feedback.value = result.message ?? "That order couldn't be given."
      return false
    }

    return true
  }

  function cancelOrder(characterId: string): boolean {
    feedback.value = null
    const result = engineClearNpcOrder(characterId)
    if (!result.success) {
      feedback.value = result.message ?? "That order couldn't be cancelled."
      return false
    }

    return true
  }

  function clearFeedback(): void {
    feedback.value = null
  }

  return {
    feedback,
    setOrder,
    cancelOrder,
    clearFeedback,
  }
}
