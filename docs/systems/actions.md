# Actions System

## Purpose

The Actions system is how characters (player and NPCs) change simulation state each turn. Actions are board-game level: a character takes a few meaningful high-level steps per turn (for example, "go to the forest clearing"), not a detailed sequence of micro-steps.

Choosing actions must be an interesting decision. Each action should feel meaningful.

The Actions system is responsible for:

- Defining available actions as LLM-callable tools (names, descriptions, parameters)
- Parsing free-text input into concrete actions and parameters
- Enforcing per-turn long vs short action limits
- Dispatching resolved actions to the correct operations in other systems
- Tracking turn action budget for each character

The Actions system does not:

- Own spatial data or movement logic (see Places system)
- Advance time or end turns (see Time system)
- Generate narration text
- Decide NPC goals or motivations (see Characters system)
- Store UI state such as input field text or pending LLM requests

---

## Behavior

### Concepts

**Action** — A high-level thing a character can do this turn. Each action has an id, human-readable name and description for the LLM, typed parameters, and a handler in another system.

Examples: go to a place, talk to a character, trade items, build something.

**Long action** — A substantial action that consumes the character's single long-action slot for the turn.

Examples: move to another region, build an item, work in a field, gather resources.

A character may perform **at most one** long action per turn.

**Short action** — A lighter action that does not consume the long-action slot.

Examples: have a conversation, trade items, move to another place in the same region, give an order to an NPC.

A character may perform **any number** of short actions per turn. Once a long action has been used, only short actions remain until the next turn.

**Action definition** — Metadata describing an action for resolution and dispatch: id, name, description, parameter schemas, and which system operation performs it. Parameter schemas include names, descriptions, types, and sometimes a dynamic list of allowed values (for example, valid place or character ids drawn from current game state).

**Resolved action** — The output of parsing character text: a concrete action id plus a parameter object. Example: action "go to place" with destination "forest-clearing".

**Turn budget** — Per-character, per-turn state tracking whether the long-action slot has been used. The Actions system checks the budget before executing an action and updates it after a successful long action.

**Requirement** — A test on game state that must pass for a given character to execute an action. Requirements are checked after parameter validation and turn-budget checks. When a requirement fails, the action is cancelled and the player is told why (for example, wrong location or missing resource at a place). Each action type defines its own requirements.

### Configuration

Actions are defined as static content and loaded at game start. Each entry describes one action the LLM can match against free-text input.

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

- **enumSource** (optional) — When set, the resolver supplies current valid values from game state (for example all place ids) so the LLM can only pick real targets.
- **handler** — Identifies which system operation runs after validation (for example, movement in the Places system).

Action definitions are static content. They are not mutated during play unless a future system explicitly adds runtime-defined actions.

### LLM resolution

Free-text input is interpreted by an LLM using the action definitions as tools (tool-calling style). The LLM returns matched actions and filled parameters. Resolution is non-deterministic; execution of a resolved action given fixed state is deterministic.

### State

Each character carries a turn budget indicating whether the long-action slot has been used this turn. Turn budgets live on character records in game state. Action definitions are loaded from static content and are not duplicated in per-save mutable state.

### Turn flow (player)

1. After the previous turn's outcomes are shown, the game prompts the player in free text (RPG dungeon-master style: "What do you do?").
2. The player responds in free text (for example, "I go to the forest clearing").
3. The Actions system resolves the text into zero or more resolved actions via the LLM.
4. For each resolved action, the system validates parameters, checks turn budget, checks action requirements, classifies long vs short, executes via the handler, and reports the outcome to the player. Failed requirements cancel the action and show a specific message to the player.
5. The player may perform more actions until they end the turn.
6. When the player ends their turn, NPCs perform actions using the same rules, driven by their goals and motivations (see Characters system).
7. Time advances to the next period (see Time system). All turn budgets reset.

### Interface

**Parse text into actions** — Interpret free-text input for a given character into zero or more resolved actions.

- Build the tool list from action definitions plus runtime enum values (for example place ids and names)
- Call the LLM with the text and tool schemas
- Return parsed resolved actions (empty list if nothing matches)
- Does not execute actions or mutate turn budget

Example: "I go to the forest clearing" → go-to-place action with destination forest-clearing.

**Classify action duration** — Determine whether a resolved action is long or short for the acting character.

- Return nothing if the action id is unknown or parameters are invalid
- For go-to-place: compare the character's current region (derived from their place via Places) to the destination place's region. Same region → short; different region → long
- For collect-resource: always long
- Other actions declare whether they are long or short as part of their definition

**Check action requirements** — Evaluate action-specific state conditions for the acting character without mutating state.

- Return nothing if all requirements pass
- Return a player-facing message if a requirement fails (for example, character not at the target place, or no gatherable resource at that place)
- Requirements are defined per action type; only collect-resource is implemented so far

**Check if action can execute** — Evaluate validity, turn budget, and requirements without mutating state.

- Validate parameters and classify duration for the resolved action
- If duration is long and the long-action slot is already used, return false
- If the action, parameters, or requirements are invalid, return false
- Otherwise return true

**Execute action** — Validate, dispatch, and update turn budget.

- No state change if the action cannot execute; return a failure result with a player-facing message when requirements or budget block execution
- Invoke the handler with the acting character and validated parameters. Domain logic lives in the target system; Actions orchestrates and enforces budget and requirement rules
- On success, if duration is long, mark the long-action slot as used
- Does not call the LLM or advance time

Example: moving within the same region is short. Moving to a different region is long and consumes the long-action slot.

**Reset turn budgets** — Clear long-action flags for all characters. Called when a new turn begins (when time advances to the next period).

### NPC actions

NPCs use the same action definitions, resolution mechanics, and turn budget rules as the player. The Characters system supplies what each NPC chooses to do; Actions resolves and executes those choices.

---

## Rules

### Long vs short classification

Classification is action-specific.

For **go to place**:

- **Short** — destination is in the **same region** as the character's current place.
- **Long** — destination is in a **different region**.

Compare the character's current region (derived from their place via the Places system) to the destination place's region before moving.

Other actions declare whether they are long or short as part of their definition.

For **collect resource**:

- **Long** — always.

Example — collect resource:

```json
{
  "id": "collect-resource",
  "name": "Collect resource",
  "description": "Gather a natural resource from a place and add it to the domain stock.",
  "parameters": [
    {
      "name": "placeId",
      "type": "string",
      "description": "The id of the place where the resource is gathered.",
      "enumSource": "places"
    },
    {
      "name": "resourceId",
      "type": "string",
      "description": "The id of the resource to collect.",
      "enumSource": "resources"
    }
  ],
  "handler": "resources.collect"
}
```

### Requirements

Requirements are checked after parameter validation and before dispatch. Failed requirements produce no state change and return a specific message to the player.

Example for **collect resource**:

- The character must be at the target **placeId**.
- The place must list the target **resourceId** in its natural resources with abundance greater than zero.

Example failure messages: "You need to be at the Forest Clearing to collect oak wood there." or "There is no oak wood to collect at the Forest Clearing."

Future actions (for example, build using stock) will add their own requirement checks (such as sufficient stock of a given type and subtype).

### Turn budget

- Before executing, if the action is **long** and the character's long-action slot is already used, reject the action (no state change).
- After a successful **long** action, mark the long-action slot as used.
- **Short** actions do not consume the long-action slot.
- At the start of each new turn (when time advances to the next period), reset all characters' turn budgets.

### Dispatch

- Look up the action definition by action id.
- Validate parameters (required fields, allowed values when enumSource is set).
- Check action requirements for the acting character.
- Invoke the handler with the acting character and validated parameters. Domain logic lives in the target system; Actions orchestrates and enforces budget and requirement rules.

### Constraints

- Action ids must be stable strings (used in content and save data).
- A character may use at most one long action per turn.
- Execution of a resolved action must be deterministic given the same state.
- Long vs short rules for movement are enforced by Actions before calling Places.
- Places movement does not check turn budget.

---

## Dependencies

**Depends on:**

- **Places** — Region lookups for movement classification; movement handler for go-to-place actions.
- **Resources** — Stock mutations for gather, trade, and build actions (when implemented).
- **Characters** — Character records, turn budgets, and NPC action choices.
- **Time** — Turn completion advances time and triggers budget reset.
- **LLM service** — Parses free-text input into resolved actions.

**Provides to:**

- **UI** — Parses player input and executes chosen actions.
- **All domain systems** — Receives dispatched actions via handler routing.

### Places integration

Movement actions call into the Places system. Both within-region and cross-region moves use the same movement operation. Actions enforces long vs short rules before calling it; Places does not check turn budget.


| Player intent              | Action cost | Handler system |
| -------------------------- | ----------- | -------------- |
| Move within same region    | Short       | Places         |
| Move to a different region | Long        | Places         |


### Time integration

Individual actions do not advance time. The player performs multiple actions, ends their turn, NPCs act, then time advances one period and turn budgets reset.

### Resources integration


| Player intent        | Typical action cost | Handler system              |
| -------------------- | ------------------- | --------------------------- |
| Collect resource     | Long                | Resources                   |
| Trade away resources | Short               | Resources (future trade)    |
| Build using stock    | Long                | Resources (future building) |


Collect resource adds the place's natural-resource abundance to domain stock after Actions verifies the character is at the target place and the resource is present with abundance greater than zero.

---

## Acceptance criteria

- Free-text input can be resolved into zero or more valid resolved actions via the LLM.
- Parsing does not mutate game state or turn budget.
- A character can execute any number of short actions per turn.
- A character can execute at most one long action per turn; further long actions are rejected with no state change.
- Go-to-place within the same region is classified as short; cross-region is classified as long.
- Executing a valid action invokes the correct handler in the target system.
- Executing a long action marks the long-action slot as used; short actions do not.
- Invalid action ids, invalid parameters, unmet requirements, or exhausted long-action budget produce no state change.
- Unmet requirements return a specific player-facing message explaining why the action was cancelled.
- When time advances to a new period, all characters' turn budgets reset.
- NPCs follow the same resolution, budget, and dispatch rules as the player.
- Action execution is deterministic given the same state and resolved action.

