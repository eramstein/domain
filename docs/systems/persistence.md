# Persistence

Save and reload runtime simulation state in the browser via IndexedDB.

## Storage

- Database: `domain` (IndexedDB)
- Object store: `saves` — keyed by save name
- Each record: `{ name, savedAt, state: GameState }`

The service layer (`src/services/database/databaseService.ts`) handles all IndexedDB I/O. It does not touch `GameState`.

## Engine

Persistence logic lives in `src/engine/persistence/`:

| Function | Role |
|----------|------|
| `bootstrapGame` | On startup, load the most recent save or call `initializeGame` |
| `saveGame(name)` | Serialize current `gameState` and write to IndexedDB |
| `loadGame(name)` | Read a named save and apply it via `applyGameState` |

Public API (from `src/engine/index.ts`):

- `engineBootstrapGame()`
- `engineSaveGame(name)`
- `engineLoadGame(name)` — returns `false` when the slot is empty

## UI shortcuts

| Key | Action |
|-----|--------|
| F5 | Quicksave (`quicksave` slot) |
| F4 | Load quicksave |

Both keys call `preventDefault()` so the browser does not refresh or focus the address bar.

## Data flow

```
F5 / startup
  → UI calls engineSaveGame / engineBootstrapGame
  → Engine reads or writes gameState
  → databaseService ↔ IndexedDB
```

Only Engine mutates `gameState`; the database service returns plain `GameState` objects.
