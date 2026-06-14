# Characters System

## Purpose

Characters are the people who inhabit the simulation. The player controls one main character — the domain owner. Everyone else is an NPC: allies, neutrals, and enemies who will eventually act as autonomous agents driven by engine logic and LLMs.

Long term, the Characters system will model personality, ambitions, relationships, and day-to-day agency. The first vertical slice establishes character records, static identity data, simple RPG attributes, and NPC classification. Relationships, goals, tasks, and LLM-driven NPC turns are deferred.

The Characters system is responsible for:

- Representing characters in runtime state (player and NPCs)
- Loading character seeds from static content at game start
- Storing identity, descriptive text, traits, attributes, health, and NPC type
- Providing character lookups for other systems and the UI

The Characters system does not:

- Move characters between places (see Places system — `placeId` lives on the character record but movement is a Places operation)
- Parse or execute turn actions (see Actions system)
- Reset or enforce per-turn action budget (see Actions system — `turnBudget` lives on the character record)
- Advance time (see Time system)
- Generate narration text
- Decide NPC goals, relationships, or what an NPC chooses to do each turn (future)

---

## Behavior

### Scope

**Vertical slice (now):**

- Character seeds with id, name, player flag, starting place, descriptions, portrait reference, personality traits, attributes, health, and NPC type
- Runtime character records including position (`placeId`), turn budget (initialized at game start; budget rules owned by Actions), ally goal (`order`), and planned steps (`actionQueue`)
- Lookups: by id, player character, list all, filter by NPC type
- NPCs execute orders from players, or by default execute collect resource action

**Deferred:**

- Relationships between characters
- Goals, ambitions, and autonomous decisions
- NPC turn loop and LLM-driven action selection
- Health transitions (sickness onset, recovery, death)
- Combat and enemy behavior

### Concepts

**Character** — A person in the simulation. Each character has a stable id, display name, and descriptive data. Exactly one character is the player (`isPlayer: true`); all others are NPCs.

**Player character** — The domain owner controlled by the player. Has `isPlayer: true` and no NPC type. Receives free-text action input from the UI.

**NPC** — Any character with `isPlayer: false`. NPCs share the same action and turn-budget rules as the player (see Actions system). In the vertical slice they are present in state and content only; they do not yet take autonomous turns.

**NPC type** — Classification for non-player characters:

| Type      | Role                                                                                                           |
| --------- | -------------------------------------------------------------------------------------------------------------- |
| `ally`    | Joined the domain; subordinate to the player and eventually orderable, but autonomous with their own ambitions |
| `neutral` | Outside the domain; interactable (for example, merchants)                                                      |
| `enemy`   | Hostile; eventually attacks the player and allies (for example, raiders)                                       |

**Physical description** — Short text paragraph describing appearance. Used for narration and LLM context.

**Portrait** — Image asset reference (path or URL) for UI display.

**Personality description** — Short text paragraph summarizing temperament and manner. Used for narration and LLM context.

**Personality traits** — Tags that characterize behavior (for example, `shy`, `brave`, `funny`). Static content; used for narration and future NPC reasoning.

**Attributes** — Simple RPG-style stats on a shared scale:

| Attribute      | Meaning                  |
| -------------- | ------------------------ |
| `strength`     | Physical power           |
| `vitality`     | Endurance and resilience |
| `intelligence` | Reasoning and learning   |

Values are non-negative integers. The vertical slice stores them; no gameplay rules consume them yet.

**Health** — Simple status for the vertical slice:

| Value     | Meaning                                                       |
| --------- | ------------------------------------------------------------- |
| `healthy` | Normal condition                                              |
| `sick`    | Unwell; future systems may restrict actions or trigger events |

**Turn budget** — Per-character, per-turn flag for whether the long-action slot has been used. Lives on the character record; owned and mutated by the Actions system (see Actions system).

**Position** — A character's current place id. Lives on the character record; movement is performed by the Places system.

### Configuration

Static content defines character seeds. Each seed specifies identity, descriptive fields, attributes, health, starting position, and (for NPCs) type.

Example — player:

```json
{
  "id": "player",
  "name": "Elias Thornwood",
  "isPlayer": true,
  "initialPlaceId": "castle-great-hall",
  "physicalDescription": "A lean man in his thirties with weathered hands and an attentive gaze.",
  "portrait": "/portraits/elias.png",
  "personalityDescription": "Cautious but fair; prefers to understand a situation before acting.",
  "personalityTraits": ["cautious", "fair", "observant"],
  "attributes": {
    "strength": 2,
    "vitality": 3,
    "intelligence": 4
  },
  "health": "healthy"
}
```

Example — ally NPC:

```json
{
  "id": "mara-blacksmith",
  "name": "Mara Voss",
  "isPlayer": false,
  "npcType": "ally",
  "initialPlaceId": "castle-kitchen",
  "physicalDescription": "Broad-shouldered, soot-marked, with a steady, unhurried manner.",
  "portrait": "/portraits/mara.png",
  "personalityDescription": "Practical and plain-spoken; loyal once trust is earned.",
  "personalityTraits": ["practical", "loyal", "blunt"],
  "attributes": {
    "strength": 4,
    "vitality": 3,
    "intelligence": 2
  },
  "health": "healthy"
}
```

Example — neutral NPC:

```json
{
  "id": "tomas-merchant",
  "name": "Tomas Reed",
  "isPlayer": false,
  "npcType": "neutral",
  "initialPlaceId": "village-market",
  "physicalDescription": "A wiry trader with quick eyes and ink-stained fingers.",
  "portrait": "/portraits/tomas.png",
  "personalityDescription": "Friendly when business is good; always calculating the next deal.",
  "personalityTraits": ["shrewd", "talkative"],
  "attributes": {
    "strength": 1,
    "vitality": 2,
    "intelligence": 3
  },
  "health": "healthy"
}
```

At game start, seeds are loaded and each character's runtime record is created with `placeId` set from `initialPlaceId` and `turnBudget.longActionUsed` set to `false`.

### State

The simulation holds a collection of character records. Each record carries:

| Field                    | Source               | Mutable during play                               |
| ------------------------ | -------------------- | ------------------------------------------------- |
| `id`                     | Seed                 | No                                                |
| `name`                   | Seed                 | No (vertical slice)                               |
| `isPlayer`               | Seed                 | No                                                |
| `npcType`                | Seed (NPCs only)     | No (vertical slice)                               |
| `physicalDescription`    | Seed                 | No (vertical slice)                               |
| `portrait`               | Seed                 | No (vertical slice)                               |
| `personalityDescription` | Seed                 | No (vertical slice)                               |
| `personalityTraits`      | Seed                 | No (vertical slice)                               |
| `attributes`             | Seed                 | No (vertical slice)                               |
| `health`                 | Seed                 | Yes (future; seeded value only in vertical slice) |
| `placeId`                | Seed → Places        | Yes (via Places movement)                         |
| `turnBudget`             | Initialized at start | Yes (via Actions)                                 |
| `order`                  | Initialized `null`   | Yes (via order assignment; cleared when goal completes, is cancelled, or is blocked) |
| `actionQueue`            | Initialized `[]`     | Yes (replanned from `order` when set; updated each NPC turn)                       |

Exactly one character must have `isPlayer: true`. NPC records must include `npcType`. The player character does not have `npcType`.

### Interface

**Look up character by id** — Return the character with the given id, or nothing if it does not exist.

**Get player character** — Return the character with `isPlayer: true`, or nothing if none exists.

**List all characters** — Return every character in the simulation.

**List characters by NPC type** — Return all NPCs whose `npcType` matches the given value (`ally`, `neutral`, or `enemy`).

**List allies** — Shorthand for NPCs with `npcType: ally`.

**Set ally order** — Store a resolved action on an ally's `order` field and plan an `actionQueue` toward that goal. Only allies accept orders; parameters must be valid. Does not execute the action immediately.

**Execute NPC turns** — When the player ends the turn, each ally executes steps from a queue planned toward their stored order; otherwise they attempt a default collect-resource action at their current place when a gatherable resource exists. As many queued steps as the turn budget allows run each turn; remaining steps persist on `actionQueue`. Orders persist across turns until the goal succeeds, the player cancels, or a non-remediable requirement blocks progress. Default actions do not persist a queue. Action execution uses the Actions system (budget, requirements, dispatch, queue planning).

Does not move characters directly, parse free text, reset turn budgets, or call the LLM.

### NPC actions

NPCs use the same action definitions and turn-budget rules as the player. Ally orders are assigned by the player via the UI; at turn end the engine executes each ally's order or default action through the Actions system.

---

## Rules

### Identity

- Character ids must be unique and remain stable strings (used in content, action parameters, and save data).
- Exactly one character must have `isPlayer: true`.
- Player characters do not have `npcType`.
- NPCs must have `npcType` set to `ally`, `neutral`, or `enemy`.

### Starting position

- Every seed's `initialPlaceId` must reference a defined place.
- At game start, each character's `placeId` is set from their seed's `initialPlaceId`.

### Attributes

- `strength`, `vitality`, and `intelligence` are non-negative integers.
- The vertical slice does not apply attribute checks to actions or events.

### Health

- `health` must be `healthy` or `sick`.
- The vertical slice does not change health during play.

### Descriptive fields

- `physicalDescription` and `personalityDescription` are plain text for display and future LLM context.
- `personalityTraits` is a list of short string tags; duplicates in a single character are not allowed.
- `portrait` is an asset reference resolved by the UI; the Characters system stores the reference only.

### Constraints

- Only the engine may mutate character state; the UI reads state and requests changes through engine operations.
- Character lookups must be deterministic — no randomness.
- `placeId` must always reference an existing place (enforced by Places when moving; validated at game start for seeds).

---

## Dependencies

**Consumed by:**

- **Actions** — Acting character, turn budgets, and (future) NPC action choices.
- **Places** — Character records and `placeId`; co-located character queries.
- **UI** — Character names, portraits, descriptions, and lists for display and action shortcuts.

**Depends on:**

- Static content for character seeds.
- **Places** — Valid `initialPlaceId` at bootstrap; movement updates `placeId`.

**Independent of:**

- Time advancement, narration content, and domain resource stock.

| Concern               | Owner                  | On character record                                         |
| --------------------- | ---------------------- | ----------------------------------------------------------- |
| Current place         | Places (movement)      | `placeId`                                                   |
| Long-action slot used | Actions (budget rules) | `turnBudget.longActionUsed`                                 |
| Identity and stats    | Characters             | id, name, descriptions, traits, attributes, health, npcType |

---

## Acceptance criteria

**Vertical slice:**

- At game start, all seeded characters are present with fields copied from their seeds.
- Exactly one character has `isPlayer: true`; all other seeded characters have a valid `npcType`.
- Every character's `placeId` matches their seed's `initialPlaceId` and references an existing place.
- Every character's `turnBudget.longActionUsed` is `false` at game start.
- Looking up a character by id returns the correct record or nothing for an unknown id.
- Getting the player character returns the `isPlayer` record.
- Listing characters by NPC type returns all and only matching NPCs.
- Attributes are non-negative; health is `healthy` or `sick`.
- Ally orders can be set on allies; the engine plans prerequisite steps (for example, travel before gathering) and executes as many steps as the turn budget allows each turn. Orders persist until completed, cancelled, or blocked. Allies without an order attempt default collect-resource at their place.
- Characters does not move characters directly, parse free text, or reset turn budgets.

**Future (out of scope for vertical slice):**

- Autonomous NPC decisions driven by goals, motivations, and LLM reasoning.
- Health changes affect available actions or trigger events.
- LLM uses personality and trait data when reasoning about NPC behavior.
