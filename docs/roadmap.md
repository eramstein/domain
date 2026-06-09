# Roadmap

Phased plan for building Domain. Each phase should leave the game in a playable (if minimal) state.

## Phase 0 — Foundation ✅ (current)

- [x] Project scaffold (Vue 3, TypeScript, Vite, Pinia)
- [x] Layered architecture: `src/engine/`, `src/state/`, `src/ui/`, `src/data/`, `src/types/`
- [x] `GameState` interface and reactive singleton
- [x] Example Engine modules (turn advancement, character spawning)
- [x] Demo screen proving read/mutate flow
- [x] Example JSON content files
- [x] Architecture documentation and Cursor rules

## Phase 1 — Minimal Vertical Slice and Core Loop

- [ ] High level UI structure (narrative section, dashboards section)
- [ ] Display current game state
- [ ] Implement one action type: collect resource
- [ ] End turn and update game state

## Guiding Principles

- Ship small vertical slices (one feature end-to-end per task)
- Keep Engine logic testable even without a test suite
- Add JSON content before hard-coding narrative
- Update `docs/current-focus.md` when changing priorities

