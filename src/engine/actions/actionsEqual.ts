import type { ResolvedAction } from '@/types'

/** Stable key for deduplicating resolved actions in a queue. */
export function actionKey(resolved: ResolvedAction): string {
  const parameterEntries = Object.entries(resolved.parameters).sort(
    ([left], [right]) => left.localeCompare(right),
  )
  return `${resolved.actionId}:${JSON.stringify(Object.fromEntries(parameterEntries))}`
}

export function actionsEqual(
  left: ResolvedAction,
  right: ResolvedAction,
): boolean {
  return actionKey(left) === actionKey(right)
}
