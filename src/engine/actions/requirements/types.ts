/** Identifies a failed requirement so planners can pick remedial actions. */
export type RequirementKind = 'at-place' | 'resource-at-place'

/** Structured requirement failure returned by action-specific checks. */
export interface RequirementFailure {
  kind: RequirementKind
  message: string
  placeId?: string
  resourceId?: string
}
