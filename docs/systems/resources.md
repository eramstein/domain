# Resources System

## Purpose

Resources are domain-wide stockpiles used to build structures, craft items, and feed characters or animals. They behave like a global currency: pooled for the domain, owned by the player, and spendable by the player or NPCs through actions.

The Resources system is responsible for:

- Representing resource types, subtypes, and specific resource definitions
- Tracking per-resource stock quantities in `GameState`
- Adding and subtracting stock (creating a stock entry when one does not yet exist)
- Looking up resources and stock levels for other systems (UI, Actions, future building/crafting)

The Resources system does not:

- Track physical storage locations (no warehouse or place-level inventory)
- Decide whether gathering or spending is allowed as a turn action (see Actions system)
- Advance time (see Time system)
- Emit narration when stock changes
- Own building, crafting, or consumption recipes (future systems call into Resources for stock mutations)

Those concerns belong to separate systems that may call into Resources.

---

# Terminology

## Resource type

A top-level category used by engine logic. Examples: construction material, food, valuable.

Types are fixed enums in code. Other systems use them for rules (for example, a character might refuse food of a given subtype).

## Resource subtype

A mid-level category within a type. Examples: wood and stone under construction material; meat under food.

Subtypes are fixed enums in code, same role as types but more specific.

## Resource

A specific, data-driven entry in the resource catalog. Examples: ebony wood, sandstone, salted pork.

Each resource has a stable string `id`, display `name`, `type`, and `subtype`. Catalog fields come from static JSON; only `amount` changes during play.

## Stock

The current quantity of a resource held by the domain. Stock is keyed by resource `id`. There is no per-place or per-character stock in this system — one pooled total per resource id.

## Stock entry

A runtime record pairing a resource `id` with its current `amount` in `GameState.resources`. Catalog metadata (`name`, `type`, `subtype`) is copied from seeds at bootstrap so lookups do not require a separate catalog pass during play.

---

# Configuration

## Static content

Resource definitions live in immutable JSON under `src/data/`.

**`resources.json`** — resource seeds with starting stock:

```json
[
  {
    "id": "wood",
    "name": "Wood",
    "type": "constructionMaterial",
    "subtype": "wood",
    "initialAmount": 30
  },
  {
    "id": "sandstone",
    "name": "Sandstone",
    "type": "constructionMaterial",
    "subtype": "stone",
    "initialAmount": 0
  },
  {
    "id": "salted-pork",
    "name": "Salted Pork",
    "type": "food",
    "subtype": "meat",
    "initialAmount": 10
  }
]
```

Loader types in `src/types/content.ts`:

```ts
export type ResourceType = 'constructionMaterial' | 'food' | 'valuable'

export type ResourceSubtype =
  | 'wood'
  | 'stone'
  | 'meat'
  // extend as new subtypes are needed

export interface ResourceSeed {
  id: string
  name: string
  type: ResourceType
  subtype: ResourceSubtype
  initialAmount: number
}
```

Enum values for `ResourceType` and `ResourceSubtype` live in `src/types/` (alongside or inside `content.ts`). JSON seeds must use only defined enum values.

Bootstrap in `src/engine/bootstrap/initializeGame.ts` maps seeds into runtime `GameState` and sets each entry's `amount` from `initialAmount`.

### Scaffold note

The vertical slice currently seeds a minimal `Resource` (`id`, `name`, `amount` only). `type` and `subtype` are the next extension before recipe or diet rules depend on them.

---

# State

## Types

```ts
export interface Resource {
  id: string
  name: string
  type: ResourceType
  subtype: ResourceSubtype
  amount: number
}
```

## State location

Resources state is stored inside the global `GameState`:

```ts
interface GameState {
  resources: Resource[]
  // ...
}
```

`GameState.resources` is an array of stock entries. Each known resource id appears at most once. Order is not significant; lookups are by `id`.

---

# Rules

## Catalog

- Every resource `id` must be unique within `resources.json`.
- Every seed `type` and `subtype` must match a defined enum value.
- Resource ids must remain stable strings (used in JSON content, action parameters, and save data).

## Stock

- Stock is domain-wide. The player owns the pool; NPC actions that spend or add resources mutate the same totals.
- Physical location is not modeled. "30 wood" means the domain has 30 wood available, not that wood sits in a specific place.
- `amount` is a non-negative number. Subtraction that would go below zero is rejected (no state change).
- When adding stock for a resource id that is not yet in `GameState.resources`, append a new entry. The entry must be creatable from catalog data (seed lookup or explicit catalog fields passed to the engine). Ad-hoc ids with no catalog definition are not supported unless a future system registers them first.

## Type and subtype in engine logic

- Rules reference `type` or `subtype`, not display names. Example: a diet rule checks `subtype === 'meat'`, not `name === 'Salted Pork'`.
- Multiple specific resources may share a subtype (ebony wood and pine wood both `subtype: 'wood'`).

---

# Engine API

Engine modules live in `src/engine/resources/`. Public wrappers are exported from `src/engine/index.ts` using the `engine*` prefix (for example `engineAddResourceStock`).

Internal functions receive `GameState` as the first argument. UI and other systems call only the `engine*` exports.

### Scaffold note

Lookup and stock mutation functions are specified here but not yet implemented. Bootstrap seeding from `resources.json` is in place.

## getResourceById(state, resourceId)

Lookup a stock entry by resource id.

Signature:

```ts
getResourceById(state: GameState, resourceId: string): Resource | undefined
```

## getResourcesByType(state, type)

Return all stock entries matching a resource type.

Signature:

```ts
getResourcesByType(state: GameState, type: ResourceType): Resource[]
```

## getResourcesBySubtype(state, subtype)

Return all stock entries matching a resource subtype.

Signature:

```ts
getResourcesBySubtype(state: GameState, subtype: ResourceSubtype): Resource[]
```

## getResourceAmount(state, resourceId)

Return the current stock amount for a resource, or `0` if no entry exists.

Signature:

```ts
getResourceAmount(state: GameState, resourceId: string): number
```

## hasResourceStock(state, resourceId, amount)

Check whether stock is sufficient without mutating state.

Signature:

```ts
hasResourceStock(
  state: GameState,
  resourceId: string,
  amount: number,
): boolean
```

Behavior:

- Return `false` if `amount` is negative or zero.
- Return `true` if the current stock for `resourceId` is greater than or equal to `amount`.
- Return `false` if no entry exists for `resourceId`.

## addResourceStock(state, resourceId, amount)

Increase stock for a resource.

Signature:

```ts
addResourceStock(
  state: GameState,
  resourceId: string,
  amount: number,
): void
```

Behavior:

- No-op if `amount` is zero or negative.
- If an entry for `resourceId` exists, increase `amount`.
- If no entry exists, create one using catalog metadata from seeds and set `amount` to the added value. No-op if `resourceId` is unknown to the catalog.

Does not:

- Advance time
- Write narration
- Check turn budget

Example:

```ts
// Domain gains 5 wood from gathering
addResourceStock(state, 'wood', 5)

// First-time stock for a seeded resource with zero initial amount
addResourceStock(state, 'sandstone', 12)
```

## subtractResourceStock(state, resourceId, amount)

Decrease stock for a resource.

Signature:

```ts
subtractResourceStock(
  state: GameState,
  resourceId: string,
  amount: number,
): void
```

Behavior:

- No-op if `amount` is zero or negative.
- No-op if no entry exists for `resourceId`.
- No-op if current stock is less than `amount` (insufficient stock).
- Otherwise decrease `amount` on the entry.

Does not:

- Advance time
- Write narration
- Check turn budget

Example:

```ts
// Spend 10 wood on construction
subtractResourceStock(state, 'wood', 10)
```

---

# Constraints

- Resource `id` values must remain stable strings (used in JSON content and save data).
- Stock amounts must not go negative; `subtractResourceStock` rejects insufficient stock.
- Only `src/engine/` modules may mutate resources state; UI calls `engineAddResourceStock` and related exports.
- Stock mutations must be deterministic — no randomness.
- `type` and `subtype` on runtime `Resource` entries must match the catalog seed for that `id`.

---

# Implementation

## Module layout

| Concern        | Path                              |
| -------------- | --------------------------------- |
| Runtime types  | `src/types/gameState.ts`          |
| Enum types     | `src/types/content.ts`            |
| Content seeds  | `src/types/content.ts` (`ResourceSeed`) |
| Static JSON    | `src/data/resources.json`         |
| Engine logic   | `src/engine/resources/`           |
| Public API     | `src/engine/index.ts`             |
| Bootstrap      | `src/engine/bootstrap/initializeGame.ts` |

## Suggested implementation order

1. Extend types (`ResourceType`, `ResourceSubtype`, `Resource.type`, `Resource.subtype`, update `ResourceSeed`)
2. Add or update `resources.json` with type and subtype on each entry
3. Update `initializeGame` to copy `type` and `subtype` from seeds
4. Implement lookup helpers and stock functions in `src/engine/resources/`
5. Export `engineGetResourceById`, `engineAddResourceStock`, `engineSubtractResourceStock`, etc. from `src/engine/index.ts`
6. Wire UI to display type, subtype, and stock (State Explorer already lists resources)
7. Add Actions handler for collect/gather that calls `addResourceStock` (see roadmap)

## Relation to Actions system

Gathering and spending resources are turn actions. The Actions system resolves free-text input, enforces long vs short budget, then dispatches to Resources engine functions.

| Player intent        | Typical action cost | Engine call                                      |
| -------------------- | ------------------- | ------------------------------------------------ |
| Gather wood          | Long                | `addResourceStock(state, 'wood', quantity)`    |
| Trade away resources | Short               | `subtractResourceStock` / `addResourceStock` on both sides (future trade system) |
| Build using stock    | Long                | `subtractResourceStock` via future building handler |

Resources does not check turn budget. Actions validates budget before calling stock mutations.

## Relation to future systems

- **Building** — subtracts construction materials via `subtractResourceStock` when a structure is placed.
- **Crafting** — subtracts inputs and adds outputs through stock functions.
- **Characters / needs** — consumption rules filter by `type` or `subtype` before subtracting food stock.
