# Roadmap

Phased plan for building Domain. Each phase should leave the game in a playable (if minimal) state.

## Phase 0 — Foundation ✅

- [x] Project scaffold (Vue 3, TypeScript, Vite, Pinia)
- [x] Layered architecture: `src/engine/`, `src/state/`, `src/ui/`, `src/data/`, `src/types/`
- [x] `GameState` interface and reactive singleton
- [x] Example Engine modules (turn advancement, character spawning)
- [x] Demo screen proving read/mutate flow
- [x] Example JSON content files
- [x] Architecture documentation and Cursor rules

## Phase 1 — Minimal Vertical Slice and Core Loop (current)

- [x] High level UI structure (narrative section, dashboards section)
- [x] Display current game state
- [x] Implement actions system basics
- [x] Implement resources system basics
- [x] End turn and update game state
- [x] Save/Reload state
- [ ] Implement NPC system basics
- [ ] Implement NPC objective system
- [ ] UI components structure for state explorer with drill downs
