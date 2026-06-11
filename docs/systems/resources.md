# Resources System

## Purpose

Resources are domain-wide stockpiles used to build structures, craft items, and feed characters or animals. They behave like a global currency: pooled for the domain, owned by the player, and spendable by the player or NPCs through actions.

The Resources system is responsible for:

- Representing resource types, subtypes, and specific resource definitions
- Tracking per-resource stock quantities
- Adding and subtracting stock (creating a stock entry when one does not yet exist)
- Looking up resources and stock levels for other systems

The Resources system does not:

- Track physical storage locations (no warehouse or place-level inventory)
- Decide whether gathering or spending is allowed as a turn action (see Actions system)
- Advance time (see Time system)
- Emit narration when stock changes
- Own building, crafting, or consumption recipes (future systems call into Resources for stock mutations)

---

## Behavior

### Concepts

**Resource type** — A top-level category used by game rules. Examples: construction material, food, valuable. Types are a fixed set defined by the game.

**Resource subtype** — A mid-level category within a type. Examples: wood and stone under construction material; meat under food. Subtypes are a fixed set defined by the game.

**Resource** — A specific, data-driven entry in the resource catalog. Examples: ebony wood, sandstone, salted pork. Each resource has a stable id, display name, type, and subtype. Catalog fields come from static content; only quantity changes during play.

**Stock** — The current quantity of a resource held by the domain. Stock is keyed by resource id. There is no per-place or per-character stock — one pooled total per resource id.

**Stock entry** — A runtime record pairing a resource id with its current quantity. Catalog metadata (name, type, subtype) is available on each entry so lookups do not require a separate catalog pass during play.

### Configuration

Resource definitions live in static content. Each seed specifies id, name, type, subtype, and initial stock:

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

At game start, seeds are loaded and each resource's quantity is set from its initial amount.

### State

The simulation holds a collection of stock entries. Each known resource id appears at most once. Order is not significant; lookups are by id.

Each entry carries: id, name, type, subtype, and amount (non-negative integer).

### Interface

**Look up resource by id** — Return the stock entry for the given resource id, or nothing if no entry exists.

**List resources by type** — Return all stock entries matching the given resource type.

**List resources by subtype** — Return all stock entries matching the given resource subtype.

**Get stock amount** — Return the current quantity for a resource id. Return 0 if no entry exists.

**Check sufficient stock** — Return whether the domain holds at least the requested quantity, without mutating state.

- Return false if the requested quantity is zero or negative
- Return false if no entry exists for the resource id
- Return true if current stock is greater than or equal to the requested quantity

**Add stock** — Increase stock for a resource.

- No-op if the quantity to add is zero or negative
- If an entry exists, increase its amount
- If no entry exists, create one using catalog metadata and set amount to the added value. No-op if the resource id is unknown to the catalog
- Does not advance time, write narration, or check turn budget

Example: the domain gains 5 wood from gathering. First-time stock for a seeded resource with zero initial amount.

**Collect resource at place** — Add stock for a resource using the abundance listed on a place's natural resources.

- No-op if the place does not exist
- No-op if the place has no matching natural resource entry, or abundance is zero or negative
- Otherwise add the abundance amount to stock
- Does not check character location, advance time, write narration, or check turn budget (the Actions system checks character location and gatherability before calling this operation)

Example: collecting oak timber at the Forest Clearing (abundance 3) adds 3 oak timber to domain stock.

**Subtract stock** — Decrease stock for a resource.

- No-op if the quantity to subtract is zero or negative
- No-op if no entry exists for the resource id
- No-op if current stock is less than the requested quantity (insufficient stock)
- Otherwise decrease the entry's amount
- Does not advance time, write narration, or check turn budget

Example: spend 10 wood on construction.

### Type and subtype in rules

- Game rules reference type or subtype, not display names. Example: a diet rule checks subtype meat, not the display name "Salted Pork".
- Multiple specific resources may share a subtype (ebony wood and pine wood both subtype wood).

---

## Rules

### Catalog

- Every resource id must be unique within the resource catalog.
- Every seed type and subtype must match a defined type or subtype value.
- Resource ids must remain stable strings (used in content, action parameters, and save data).

### Stock

- Stock is domain-wide. The player owns the pool; NPC actions that spend or add resources mutate the same totals.
- Physical location is not modeled. "30 wood" means the domain has 30 wood available, not that wood sits in a specific place.
- Amount is a non-negative number. Subtraction that would go below zero is rejected (no state change).
- When adding stock for a resource id that is not yet in state, append a new entry creatable from catalog data. Ad-hoc ids with no catalog definition are not supported unless a future system registers them first.

### Constraints

- Stock amounts must not go negative.
- Only the engine may mutate resources state; the UI reads state and requests changes through engine operations.
- Stock mutations must be deterministic — no randomness.
- Type and subtype on runtime entries must match the catalog seed for that id.

---

## Dependencies

**Consumed by:**

- **Actions** — Dispatches collect-resource (and future trade and build) actions to stock mutations after budget and requirement validation.
- **UI** — Displays resource types, subtypes, and stock levels.
- **Future: Building** — Subtracts construction materials when a structure is placed.
- **Future: Crafting** — Subtracts inputs and adds outputs through stock operations.
- **Future: Characters / needs** — Consumption rules filter by type or subtype before subtracting food stock.

**Depends on:**

- Static content for resource catalog and initial stock amounts.

**Independent of:**

- Turn budget, time advancement, narration, and physical place inventory.

| Player intent        | Typical action cost (Actions) | Resources operation |
| -------------------- | ----------------------------- | ------------------- |
| Collect resource     | Long                          | Add stock (place abundance) |
| Trade away resources | Short                         | Subtract / add stock on both sides (future trade system) |
| Build using stock    | Long                          | Subtract stock (future building handler) |

Resources does not check turn budget. Actions validates budget before calling stock mutations.

---

## Acceptance criteria

- At game start, all seeded resources are present with quantities matching their initial amounts.
- Looking up a resource by id returns the correct entry including type, subtype, and amount.
- Listing by type or subtype returns all and only matching entries.
- Getting amount for an unknown resource id returns 0.
- Adding stock increases the entry; adding to an unknown catalog id produces no change.
- Subtracting stock decreases the entry when sufficient; insufficient stock, unknown id, or non-positive quantity produces no change.
- Stock never goes negative.
- Type and subtype on runtime entries match their catalog definitions.
