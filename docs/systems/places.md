# Places System

## Purpose

The Places system handles spatial positions in the game world. Characters (and, when the inventory system exists, items) have a current position and can move.

Geography is board-game level: two tiers only — **region** and **place**. There are no coordinates, distances, or pathfinding. It is narrative geography, not a spatial simulation.

The Places system is responsible for:

- Representing regions and places in runtime state
- Tracking which place each character occupies
- Moving characters between places
- Looking up places and regions for other systems (UI, Actions)

The Places system does not:

- Compute routes or travel time
- Advance time (see Time system)
- Decide whether a move is allowed as a turn action (see Actions system)
- Emit narration or events when someone moves
- Manage visibility or fog of war

Those concerns belong to separate systems that may call into Places.

---

# Terminology

## Region

A high-level geographic zone. Examples: a castle, a forest, a village.

Regions are containers. A region has one or more places. Regions are identified by stable string `id` values.

## Place

A specific location within a region. Examples: the kitchen inside the castle, a clearing inside the forest.

Every place belongs to exactly one region via `regionId`. Characters are always positioned at the **place** level, not the region level. The region is derived from the place's parent.

## Position

A character's position is a `placeId` referencing a `Place` in `GameState.places`. The character's region is always `place.regionId` — it is never stored separately on the character.

Items will use the same model (`placeId`) when the inventory system is implemented.

## Dynamic creation

Regions and places defined in static JSON are seeded at game start. Additional places may be created at runtime (for example, when the player builds a new structure). Runtime-created places follow the same `Place` shape as seeded ones.

---

# Configuration

## Static content

Region and place definitions live in immutable JSON under `src/data/`.

**`regions.json`** — region seeds:

```json
[
  {
    "id": "castle",
    "name": "Ashwick Keep"
  },
  {
    "id": "forest",
    "name": "Whisperwood"
  }
]
```

**`places.json`** — place seeds (each references a region):

```json
[
  {
    "id": "castle-great-hall",
    "name": "Great Hall",
    "regionId": "castle"
  },
  {
    "id": "castle-kitchen",
    "name": "Kitchen",
    "regionId": "castle"
  },
  {
    "id": "forest-clearing",
    "name": "Forest Clearing",
    "regionId": "forest"
  }
]
```

**`characters.json`** — starting position per character seed:

```json
[
  {
    "id": "player",
    "name": "Elias Thornwood",
    "isPlayer": true,
    "initialPlaceId": "castle-great-hall"
  }
]
```

Loader types in `src/types/content.ts`:

```ts
export interface RegionSeed {
  id: string
  name: string
}

export interface PlaceSeed {
  id: string
  name: string
  regionId: string
}
```

`CharacterSeed` gains `initialPlaceId: string` (must reference a place in `places.json`).

Bootstrap in `src/engine/bootstrap/initializeGame.ts` maps seeds into runtime `GameState` and sets each character's `placeId` from `initialPlaceId`.

---

# State

## Types

```ts
export interface Region {
  id: string
  name: string
}

export interface Place {
  id: string
  name: string
  regionId: string
}
```

`Character` includes position:

```ts
export interface Character {
  id: string
  name: string
  isPlayer: boolean
  placeId: string
}
```

## State location

Places state is stored inside the global `GameState`:

```ts
interface GameState {
  regions: Region[]
  places: Place[]
  characters: Character[]
  // ...
}
```

`regionId` on `Place` is the single source of truth for regional membership. Characters do not store `regionId`.

---

# Rules

## Hierarchy

- Every `Place` must reference an existing `Region` via `regionId`.
- A region may contain any number of places (including one).
- Place and region `id` values must be unique within their respective arrays.

## Position

- Every character must have a `placeId` that references an existing place.
- To determine a character's region, resolve `character.placeId` → `place.regionId`.

## Movement

- `goTo` sets `character.placeId` to the target place.
- Moving between places in the **same** region is a **short** action (see Actions system).
- Moving to a place in a **different** region is a **long** action (see Actions system).
- Places does not enforce long vs short rules — the Actions system validates turn budget before calling `goTo`.

## Runtime place creation

When a new place is created at runtime (future building system):

- Append a new `Place` to `gameState.places`.
- The `regionId` must reference an existing region.
- The new `id` must not collide with an existing place.

---

# Engine API

Engine modules live in `src/engine/places/`. Public wrappers are exported from `src/engine/index.ts` using the `engine*` prefix (for example `engineGoTo`).

Internal functions receive `GameState` as the first argument. UI and other systems call only the `engine*` exports.

## getPlaceById(state, placeId)

Lookup a place by id.

Signature:

```ts
getPlaceById(state: GameState, placeId: string): Place | undefined
```

## getRegionById(state, regionId)

Lookup a region by id.

Signature:

```ts
getRegionById(state: GameState, regionId: string): Region | undefined
```

## getRegionForPlace(state, placeId)

Return the region that contains the given place.

Signature:

```ts
getRegionForPlace(state: GameState, placeId: string): Region | undefined
```

Behavior:

- Resolve `placeId` → `Place` → `place.regionId` → `Region`
- Return `undefined` if the place or region does not exist

## getPlacesInRegion(state, regionId)

Return all places in a region.

Signature:

```ts
getPlacesInRegion(state: GameState, regionId: string): Place[]
```

## getCharactersAtPlace(state, placeId)

Return all characters currently at a place.

Signature:

```ts
getCharactersAtPlace(state: GameState, placeId: string): Character[]
```

## goTo(state, characterId, placeId)

Move a character to a new place.

Signature:

```ts
goTo(state: GameState, characterId: string, placeId: string): void
```

Behavior:

- Find the character by `characterId`; no-op if not found
- Find the target place by `placeId`; no-op if not found
- Set `character.placeId` to `placeId`

Does not:

- Advance time
- Check long vs short action rules
- Write narration

Example:

```ts
// Character in Great Hall moves to Kitchen (same region — short action)
goTo(state, 'player', 'castle-kitchen')

// Character moves to Forest Clearing (different region — long action)
goTo(state, 'player', 'forest-clearing')
```

## createPlace(state, place)

Add a new place at runtime. Deferred until the building system exists; documented here for completeness.

Signature:

```ts
createPlace(state: GameState, place: Place): void
```

Behavior:

- No-op if `place.id` already exists
- No-op if `place.regionId` does not reference an existing region
- Otherwise append `place` to `state.places`

---

# Constraints

- Every character `placeId` must reference a place that exists in `state.places`.
- Every place `regionId` must reference a region that exists in `state.regions`.
- Region and place ids must remain stable strings (used in JSON content and save data).
- `goTo` must be deterministic — no randomness.
- Only `src/engine/` modules may mutate places state; UI calls `engineGoTo` and related exports.

---

# Implementation

## Module layout

| Concern        | Path                              |
| -------------- | --------------------------------- |
| Runtime types  | `src/types/gameState.ts`          |
| Content seeds  | `src/types/content.ts`            |
| Static JSON    | `src/data/regions.json`, `places.json` |
| Engine logic   | `src/engine/places/`              |
| Public API     | `src/engine/index.ts`             |
| Bootstrap      | `src/engine/bootstrap/initializeGame.ts` |

## Suggested implementation order

1. Extend types (`Region`, `Place.regionId`, `Character.placeId`, seed types)
2. Add or update JSON content and loader exports
3. Update `initializeGame` to seed regions, places, and starting positions
4. Implement lookup helpers and `goTo` in `src/engine/places/`
5. Export `engineGoTo`, `engineGetPlaceById`, etc. from `src/engine/index.ts`
6. Wire UI to display region, place, and character location

## Relation to Actions system

The Actions system resolves free-text player input into typed actions, then calls Places engine functions:

| Player intent              | Action cost | Engine call                                      |
| -------------------------- | ----------- | ------------------------------------------------ |
| Move within same region    | Short       | `goTo(state, characterId, placeId)`            |
| Move to a different region | Long        | `goTo(state, characterId, placeId)`            |

Both paths use the same `goTo` function. The Actions layer enforces long vs short rules before calling it.
