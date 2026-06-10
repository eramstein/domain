/** Per-character action budget for the current turn. */
export interface TurnBudget {
  longActionUsed: boolean
}

/** A concrete action ready for dispatch. */
export interface ResolvedAction {
  actionId: string
  parameters: Record<string, string | number | boolean>
}

export type ActionDuration = 'short' | 'long'
