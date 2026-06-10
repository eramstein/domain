import type { GameState } from '@/types'

export function appendNarration(state: GameState, text: string): void {
  state.narration.push({
    id: `narration-${state.narration.length}-${Date.now()}`,
    text,
  })
}
