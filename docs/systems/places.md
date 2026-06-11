# Places System

## Purpose

The Places system handles spatial positions in the game world. Characters (and, when the inventory system exists, items) have a current position and can move between places.

Geography is board-game level: two tiers only — **region** and **place**. There are no coordinates, distances, or pathfinding. It is narrative geography, not a spatial simulation.

The Places system is responsible for:

- Representing regions and places in runtime state
- Tracking which place each character occupies
- Moving characters between places
- Looking up places, regions, and co-located characters for other systems

The Places system does not:

- Compute routes or travel time
- Advance time (see Time system)
- Decide whether a move is allowed as a turn action or enforce turn budget (see Actions system)
- Emit narration or events when someone moves
- Manage visibility or fog of war

---

## Behavior

### Concepts

**Region** — A high-level geographic zone (for example, a castle, a forest, a village). Regions are containers identified by stable string ids. A region has one or more places.

**Place** — A specific location within a region (for example, the kitchen inside the castle, a clearing inside the forest). Every place belongs to exactly one region. Characters are always positioned at the **place** level, not the region level.

**Position** — A character's position is a place id. The character's region is always derived from that place's parent region — it is never stored separately on the character.

**Dynamic creation** — Regions and places defined in static content are seeded at game start. Additional places may be created at runtime (for example, when the player builds a new structure). Runtime-created places follow the same shape as seeded ones.

### Configuration

Static content defines:

**Regions** — Each region has a stable id and display name.

```json
[
  { "id": "castle", "name": "Ashwick Keep" },
  { "id": "forest", "name": "Whisperwood" }
]
```

**Places** — Each place has a stable id, display name, and parent region id.

```json
[
  { "id": "castle-great-hall", "name": "Great Hall", "regionId": "castle" },
  { "id": "castle-kitchen", "name": "Kitchen", "regionId": "castle" },
  { "id": "forest-clearing", "name": "Forest Clearing", "regionId": "forest" }
]
```

**Character starting positions** — Each character seed specifies an initial place id that must reference a defined place.

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

At game start, regions and places are loaded from static content and each character's position is set from their initial place id.

### State

The simulation holds:

- A collection of regions (id, name)
- A collection of places (id, name, region id)
- Each character's current place id

Regional membership is determined solely by `place.regionId`. Characters do not store a separate region id.

### Interface

**Look up place by id** — Return the place with the given id, or nothing if it does not exist.

**Look up region by id** — Return the region with the given id, or nothing if it does not exist.

**Get region for place** — Resolve place id → place → parent region. Return nothing if the place or its region does not exist.

**List places in region** — Return all places whose parent region matches the given region id.

**List characters at place** — Return all characters whose current place id matches the given place id.

**Move character to place** — Set the character's place id to the target place.

- No-op if the character does not exist
- No-op if the target place does not exist
- Does not advance time, check turn budget, or produce narration

Example: a character in the Great Hall moves to the Kitchen (same region). A character in the Great Hall moves to the Forest Clearing (different region). Both use the same move operation; the Actions system classifies cost before calling.

**Create place at runtime** — Add a new place to the simulation.

- No-op if a place with the same id already exists
- No-op if the place's region id does not reference an existing region
- Otherwise append the new place

Deferred until the building system exists; documented here for completeness.

---

## Rules

### Hierarchy

- Every place must reference an existing region.
- A region may contain any number of places (including one).
- Place and region ids must be unique within their respective collections.

### Position

- Every character must have a place id that references an existing place.
- To determine a character's region, resolve their place id to the place, then read its region id.

### Movement

- Moving sets the character's place id to the target place.
- Moving between places in the **same** region is a **short** action (see Actions system).
- Moving to a place in a **different** region is a **long** action (see Actions system).
- Places does not enforce long vs short rules — the Actions system validates turn budget before invoking movement.

### Runtime place creation

When a new place is created at runtime:

- The region id must reference an existing region.
- The new id must not collide with an existing place.

### Constraints

- Region and place ids must remain stable strings (used in content and save data).
- Movement must be deterministic — no randomness.
- Only the engine may mutate places state; the UI reads state and requests changes through engine operations.

---

## Dependencies

**Consumed by:**

- **Actions** — Classifies movement as long or short by comparing regions; dispatches movement after budget validation.
- **UI** — Displays region, place, and character location.

**Depends on:**

- Static content for region and place definitions and character starting positions.
- Characters system for character records and their place ids.

**Independent of:**

- Time advancement, narration, turn budget, and resource stock.

| Player intent              | Action cost (Actions) | Places operation        |
| -------------------------- | --------------------- | ----------------------- |
| Move within same region    | Short                 | Move character to place |
| Move to a different region | Long                  | Move character to place |

---

## Acceptance criteria

- At game start, all seeded regions and places are present and every character is at their initial place.
- Every character's place id references an existing place.
- Every place's region id references an existing region.
- Looking up a character's region via their place returns the correct parent region.
- Moving a character to a valid place updates their position; invalid character or place ids produce no change.
- Listing characters at a place returns all and only characters currently there.
- Creating a runtime place succeeds when the region exists and the id is unique; duplicate or invalid region ids produce no change.
- Places does not check or modify turn budget when moving a character.
