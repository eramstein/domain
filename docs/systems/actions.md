# Actions System

## Purpose

The Actions system is how characters (player and NPCs) change simulation state each turn. Actions are board-game level: a character takes a few meaningful high-level steps per turn (for example, "go to the forest clearing"), not a detailed sequence of micro-steps.

Choosing actions must be an interesting decision. Each action should feel meaningful.

The Actions system is responsible for:

- Defining available actions as LLM-callable tools (names, descriptions, parameters)
- Parsing free-text input into typed actions and parameters
- Enforcing per-turn long vs short action limits
- Dispatching resolved actions to the correct functions in other systems
- Tracking turn action budget for each character

The Actions system does not:

- Own spatial data or movement logic (see Places system)
- Advance time or end turns (see Time system)
- Generate narration text
- Decide NPC goals or motivations (see Characters system)
- Store UI state such as input field text or pending LLM requests

Those concerns belong to separate systems that Actions may call into.

---

# Terminology

## Action

A high-level thing a character can do this turn. Each action has an `id`, human-readable `name` and `description` for the LLM, typed `parameters`, and a handler in another system.

Examples: go to a place, talk to a character, trade items, build something.

## Long action

A substantial action that consumes the character's single long-action slot for the turn.

Examples:

- Move to another region
- Build an item
- Work in a field
- Gather resources

A character may perform **at most one** long action per turn.

## Short action

A lighter action that does not consume the long-action slot.

Examples:

- Have a conversation
- Trade items
- Move to another place in the same region
- Give an order to an NPC

A character may perform **any number** of short actions per turn. Once a long action has been used, only short actions remain until the next turn.

## Action definition

Metadata describing an action for resolution and dispatch: `id`, `name`, `description`, parameter schemas, and which handler performs it. Parameter schemas include names, descriptions, types, and sometimes a dynamic list of allowed values (for example, valid place or character ids drawn from current game state).

## Resolved action

The output of parsing character text: a concrete action `id` plus a parameter object.

```ts
{ actionId: 'goto', parameters: { placeId: 'forest-clearing' } }
```

## Turn budget

Per-character, per-turn state tracking whether the long-action slot has been used. The Actions system checks the budget before executing an action and updates it after a successful long action.

---

# Configuration

## Action definitions

Actions are defined as data and loaded at game start. Each entry describes one action the LLM can match against free-text input.

Example — go to place:

```json
{
  "id": "goto",
  "name": "Go to place",
  "description": "Move the character to a different place in the world.",
  "parameters": [
    {
      "name": "placeId",
      "type": "string",
      "description": "The id of the destination place.",
      "enumSource": "places"
    }
  ],
  "handler": "places.goTo"
}
```

- `enumSource` is optional. When set, the resolver supplies current valid values from game state (for example all place ids) so the LLM can only pick real targets.
- `handler` identifies which system function runs after validation (for example `places.goTo`).

Action definitions are static content. They are not mutated during play unless a future system explicitly adds runtime-defined actions.

## LLM resolution

Free-text input is interpreted by an LLM using the action definitions as tools (tool-calling style). The LLM returns matched actions and filled parameters. Resolution is non-deterministic; execution of a resolved action given fixed state is deterministic.

---

# State

## Types

```ts
export interface TurnBudget {
  longActionUsed: boolean
}

export interface ResolvedAction {
  actionId: string
  parameters: Record<string, string | number | boolean>
}
```

Each character carries a turn budget:

```ts
export interface Character {
  id: string
  name: string
  isPlayer: boolean
  placeId: string
  turnBudget: TurnBudget
}
```

## State location

Turn budgets live on characters inside `GameState`. Action definitions are loaded from static content and are not duplicated in per-save mutable state.

---

# Rules

## Turn flow (player)

1. After the previous turn's outcomes are shown, the game prompts the player in free text (RPG dungeon-master style: "What do you do?").
2. The player responds in free text (for example, "I go to the forest clearing").
3. The Actions system resolves the text into zero or more resolved actions via the LLM.
4. For each resolved action, the system validates turn budget, classifies long vs short, executes via the handler, and reports the outcome to the player.
5. The player may perform more actions until they end the turn.
6. When the player ends the turn, NPCs perform actions using the same rules, driven by their goals and motivations (see Characters system).
7. Time advances to the next period (see Time system). All turn budgets reset.

## Long vs short classification

Classification is action-specific.

For **go to place**:

- **Short** — destination is in the **same region** as the character's current place.
- **Long** — destination is in a **different region**.

Compare the character's current region (derived from their place via the Places system) to the destination place's region before moving.

Other actions declare whether they are long or short as part of their definition.

## Turn budget

- Before executing, if the action is **long** and the character's long-action slot is already used, reject the action (no state change).
- After a successful **long** action, mark the long-action slot as used.
- **Short** actions do not consume the long-action slot.
- At the start of each new turn (when time advances to the next period), reset all characters' turn budgets.

## Dispatch

- Look up the action definition by `actionId`.
- Validate parameters (required fields, allowed values when `enumSource` is set).
- Invoke the handler with the acting character and validated parameters. Domain logic lives in the target system; Actions orchestrates and enforces budget rules.

## NPC actions

NPCs use the same action definitions, resolution mechanics, and turn budget rules as the player. The Characters system supplies what each NPC chooses to do; Actions resolves and executes those choices.

---

# Engine API

## findActionsInText(state, characterId, text)

Parse free-text input into zero or more resolved actions.

Signature:

```ts
findActionsInText(
  state: GameState,
  characterId: string,
  text: string,
): Promise<ResolvedAction[]>
```

Behavior:

- Build the tool list from action definitions plus runtime enum values (for example place ids and names).
- Call the LLM with the text and tool schemas.
- Return parsed resolved actions (empty array if nothing matches).
- Does not execute actions or mutate turn budget.

Example:

```ts
await findActionsInText(state, 'player', 'I go to the forest clearing')
// → [{ actionId: 'goto', parameters: { placeId: 'forest-clearing' } }]
```

## getActionDuration(state, characterId, resolved)

Classify whether a resolved action is long or short for the acting character.

Signature:

```ts
type ActionDuration = 'short' | 'long'

getActionDuration(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): ActionDuration | undefined
```

Behavior:

- Return `undefined` if `actionId` is unknown or parameters are invalid.
- For `goto`, compare current region vs destination region via Places lookups.

## canExecuteAction(state, characterId, resolved)

Check turn budget and validity without mutating state.

Signature:

```ts
canExecuteAction(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): boolean
```

Behavior:

- Resolve duration via `getActionDuration`.
- If duration is `long` and the long-action slot is already used, return `false`.
- If the action or parameters are invalid, return `false`.
- Otherwise return `true`.

## executeAction(state, characterId, resolved)

Validate, dispatch, and update turn budget.

Signature:

```ts
executeAction(
  state: GameState,
  characterId: string,
  resolved: ResolvedAction,
): void
```

Behavior:

- No-op if `canExecuteAction` would return `false`.
- Invoke the handler (for example `goTo` in the Places system for `goto`).
- On success, if duration is `long`, mark the long-action slot as used.

Does not:

- Call the LLM
- Advance time
- Write narration

Example:

```ts
// Same region — short
executeAction(state, 'player', {
  actionId: 'goto',
  parameters: { placeId: 'castle-kitchen' },
})

// Different region — long, consumes long-action slot
executeAction(state, 'player', {
  actionId: 'goto',
  parameters: { placeId: 'forest-clearing' },
})
```

## resetTurnBudgets(state)

Clear long-action flags for all characters.

Signature:

```ts
resetTurnBudgets(state: GameState): void
```

Behavior:

- Set `longActionUsed` to `false` for every character.

Called when a new turn begins (when time advances to the next period).

---

# Relation to other systems

## Places

Movement actions call into the Places system. Both within-region and cross-region moves use the same `goTo` function. Actions enforces long vs short rules before calling it; Places does not check turn budget.

| Player intent              | Action cost | Handler                          |
| -------------------------- | ----------- | -------------------------------- |
| Move within same region    | Short       | `goTo(state, characterId, placeId)` |
| Move to a different region | Long        | `goTo(state, characterId, placeId)` |

## Time

Individual actions do not advance time. The player performs multiple actions, ends their turn, NPCs act, then time advances one period and turn budgets reset.

---

# Constraints

- Action `id` values must be stable strings (used in content and save data).
- A character may use at most one long action per turn.
- Execution of a resolved action must be deterministic given the same state.
- Long vs short rules for movement are enforced by Actions before calling Places.
- Places `goTo` does not check turn budget.
