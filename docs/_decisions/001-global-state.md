# ADR 001: Single Global GameState

**Status:** Accepted  
**Date:** 2026-06-08

## Context

Domain is a turn-based simulation with many interconnected systems (characters, inventory, calendar, events). State must be easy to inspect, serialize for saves, and update reactively in the UI.

Alternatives considered:

1. **Pinia store for all state** — Simple in Vue, but mixes simulation and UI concerns
2. **Multiple domain stores** — Characters store, inventory store, etc.; harder to save atomically
3. **Single global `GameState` object** — One source of truth for runtime simulation

## Decision

Use a **single reactive `GameState` singleton** in `src/state/gameState.ts` for all runtime simulation data.

- UI-specific state lives in **separate Pinia stores** under `src/ui/stores/`
- **Engine modules** are the only code that mutates `GameState`
- UI reads through `useGameState()` which exposes a **read-only** proxy

## Consequences

### Positive

- Save/load is straightforward: serialize one object
- Engine functions can reason about the full world state
- Clear boundary between simulation and presentation
- Vue reactivity works without extra glue

### Negative

- Large state object may grow complex; discipline needed to keep it organized
- No built-in compile-time enforcement preventing UI mutation (relies on convention and review)
- All Engine modules depend on the shared state shape; type changes ripple

## Compliance

- Do **not** add `selectedTab`, `isModalOpen`, or similar fields to `GameState`
- Do **not** mutate `gameState` from `.vue` files
- Export new Engine actions from `src/engine/index.ts` rather than reaching into domain modules from UI
