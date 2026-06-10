# Architecture

Domain is a browser-only, turn-based management simulation. The codebase separates **simulation state**, **mutation logic**, **presentation**, and **static content** into distinct layers.

## Layer Overview

All application code lives under `src/`. Project-level folders (`docs/`, `.cursor/`) stay at the repo root.

```
┌─────────────────────────────────────────────────────────┐
│  src/ui/      Vue components, Pinia stores, styles    │
│               Reads GameState · Calls Engine actions    │
├─────────────────────────────────────────────────────────┤
│  src/engine/  Pure TypeScript business logic            │
│               Owns all GameState mutations              │
├─────────────────────────────────────────────────────────┤
│  src/state/   Reactive GameState singleton              │
│               Runtime simulation data only              │
├─────────────────────────────────────────────────────────┤
│  src/services/ External I/O (LLM, database, …)          │
│               No direct GameState ownership             │
├─────────────────────────────────────────────────────────┤
│  src/data/    Static JSON content (immutable)           │
│  src/types/   Shared TypeScript interfaces              │
└─────────────────────────────────────────────────────────┘
```

## State (`src/state/`)

`GameState` is a single reactive object representing everything that changes during play:

- Places
- Characters
- Items
- Event log
- etc...

**Rules:**

- `GameState` contains **runtime simulation data only**
- UI concerns (selected tab, panel visibility, scroll position) belong in **Pinia stores** under `src/ui/stores/`
- Components read state via `useGameState()` which returns a **read-only** view
- Only `src/engine/` modules may mutate the underlying `gameState` object

## Engine (`src/engine/`)

The Engine layer owns all state transitions. Organize modules by domain/system:

```
src/engine/
  bootstrap/     Game initialization
  characters/    Character spawning and updates
  time/          Calendar and turn advancement
  inventory/     (future) Item transfers
  events/        (future) Event resolution
```

**Rules:**

- Engine functions receive or import `gameState` and perform mutations
- Prefer **pure functions** where practical: `(state: GameState, ...args) => void`
- Vue components **never** import `gameState` directly for mutation
- UI invokes Engine through the public API in `src/engine/index.ts`

## UI (`src/ui/`)

Vue 3 components render simulation state and forward player input to Engine actions.

```
src/ui/
  components/    Reusable presentational pieces
  views/         Screen-level layouts
  stores/        Pinia stores for UI-only state
  styles/        Global CSS
```

**Rules:**

- `<script setup lang="ts">` everywhere
- Components call `engineAdvanceTurn()`, not `gameState.date.turn += 1`
- Use Pinia for selection, layout, modals, and other presentation state

## Data (`src/data/`)

Static game content lives in JSON files and is loaded at build time, such as:

- Item definitions
- Event definitions
- Character templates

Content is **immutable** and never written into `GameState` wholesale. Engine code reads definitions and creates runtime instances (e.g. spawning a character from a template).

## Types (`src/types/`)

Shared interfaces for runtime state (`GameState`) and static content (item/event definitions). Keep types free of implementation logic.

## Services (`src/services/`)

Services wrap **external systems** — APIs and persistence that live outside the simulation. They sit beside the core layers and are called when the game needs outside I/O.

```
src/services/
  llm/           Mistral chat completions (LLMService)
  database/      (planned) Persistence and queries
```

**Rules:**

- Services **do not** own or mutate `GameState`; Engine applies their results to state when needed
- Prefer calling services from **Engine** modules, not directly from Vue components (keeps side effects out of the UI layer)
- Each service module exposes a small, focused API (e.g. `llmService.chat()`)
- When no credentials are configured, services may degrade gracefully (e.g. mock LLM responses) so local dev still runs

### Secrets and environment

API keys and other secrets live in a **root `.env` file** (never commit this file). Vite exposes variables prefixed with `VITE_` to application code via `import.meta.env`.

| Variable               | Used by              |
| ---------------------- | -------------------- |
| `VITE_MISTRAL_API_KEY` | `src/services/llm/`  |

Restart the dev server after changing `.env`.

## Data Flow Example

1. Player clicks **Advance Turn** in `DemoView.vue`
2. Component calls `engineAdvanceTurn()` from `src/engine/index.ts`
3. Engine module `advanceTurn()` mutates `gameState`
4. Vue reactivity updates all bound UI automatically

### Services example

1. Engine module needs NPC dialogue and calls `llmService.chat(messages)`
2. `LLMService` reads `VITE_MISTRAL_API_KEY` from the environment and calls the Mistral API
3. Engine receives the text, writes any simulation updates to `gameState`, and returns control to the UI

## Path Aliases


| Alias       | Path          |
| ----------- | ------------- |
| `@engine/`* | `src/engine/` |
| `@state/*`  | `src/state/`  |
| `@ui/*`     | `src/ui/`     |
| `@data/*`   | `src/data/`   |
| `@/types`   | `src/types/`  |
| `@/services/*` | `src/services/` (via `@` → `src`) |


## Adding a New Feature

1. Define or extend types in `src/types/`
2. Add static content to `src/data/*.json` if needed
3. Implement Engine logic in the appropriate `src/engine/<domain>/` module
4. Add or extend a service in `src/services/<name>/` if the feature needs external I/O
5. Export a named action from `src/engine/index.ts`
6. Wire UI to call the Engine action and render resulting state

