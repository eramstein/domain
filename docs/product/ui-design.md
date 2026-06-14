# UI Design

Product-level look, layout, and interaction model for Domain. Complements [game-design.md](./game-design.md).

---

## Look and Feel

- **Simplicity** — Mostly text and static images. Few borders, shadows, or other decoration. Animate state changes only when explicitly requested.
- **Dual tone** — Narration feels like a book being written. The domain dashboard feels like a board game / business application: compact lists, scannable data.
- **Color** — Frugal palette. Reserve color for important data highlights so they stand out.

Section headings use muted uppercase labels. The narration column uses a serif tone for a book-like read.

---

## Layout

Two main sections, visible side by side on desktop:

| Column                              | Role                           | Tone                   |
| ----------------------------------- | ------------------------------ | ---------------------- |
| **Narration** (primary, wider)      | Story, player input, turn flow | Book                   |
| **Dashboard** (secondary, narrower) | Explore simulation state       | Board game / dashboard |

On narrow viewports the columns stack: narration first, dashboard below.

Navigation within the dashboard stays inside that column — it does not take over the full screen or replace the narration column.

---

## Narration Section

Linear, top-to-bottom presentation of events. Should read like pages of a book.

**Contents (top to bottom):**

1. **Event log** — Chronological narration of what has happened.
2. **Player input** — Free-text action field (“What do you do?”) with submit.
3. **System feedback** — Inline messages (e.g. action could not be resolved, turn budget notes).
4. **Quick actions** — One button per available action type. Clicking opens an inline parameter picker; multi-parameter actions prompt step by step (e.g. place, then resource). Options reflect current game state. No LLM call — same outcome as typing the action.
5. **End turn** — Button to advance the simulation turn.

**Quick actions vs action widgets** — Quick actions are generic shortcuts for actions that only need picking from a list of valid targets. **Action widgets** are richer, action-specific UIs in this column (e.g. trade with a merchant). Widgets are for flows that need more than a simple picker. See [game-design.md](./game-design.md).

---

## Dashboard Section

Read-only exploration of simulation data by default. Presents hard facts from the simulation; narrative summaries (character arcs, etc.) appear when those systems exist.

The dashboard uses **in-column navigation** with breadcrumbs.

### Navigation hierarchy

```
Dashboard (home)
├── Resources (topic)
├── Characters (topic)
│   └── Character sheet (entity)
└── Places (topic)
    └── Place sheet (entity)
```

**Rules:**

- Clicking a **widget title** on the home dashboard opens its topic view.
- Clicking a **character name** opens that character's sheet.
- Clicking a **place name** opens that place's sheet.
- **Breadcrumbs** reflect the path above; each segment navigates up one level.
- The home dashboard is always one click away from breadcrumbs (root segment).

### Views

#### Home dashboard

Compact summary widgets. Goal: all widgets visible without scrolling on a typical desktop viewport.

Widget order (most important first):

1. **Time** — Current date and period (morning / afternoon / night).
2. **Resources** — Totals aggregated by type and subtype (not every stock line).
3. **Characters** — Name and current place for each character.
4. **Places** — Region image and names grouped by region; place names as text links.

#### Topic views

Full lists with more detail than the home widgets:

| Topic          | Shows                                                            |
| -------------- | ---------------------------------------------------------------- |
| **Resources**  | Every stock entry, grouped by type → subtype                     |
| **Characters** | Name, place, health, NPC type                                    |
| **Places**     | Place image, name, region, natural resources, characters present |

#### Entity sheets

| Sheet         | Shows                                                                                                                           |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Character** | All available character details: identity, descriptions, traits, attributes, health, place, turn budget, portrait when present. Ally sheets show **Give order** action buttons below the portrait when no order is set; once set, the pending order and a cancel control replace the picker until cleared. |
| **Place**     | Place image, name, region, natural resources, characters currently here                                                         |

Sheets are the deepest level; breadcrumbs end at the entity name.

### Actions vs exploration

**Default:** dashboard views are for reading state.

**Gameplay from the dashboard** should be the exception. Prefer acting through the narration column (free text, quick actions, or action widgets). Any control that changes the simulation must go through the same rules as player input elsewhere — not by editing state directly in the UI.

**Ally orders** — On ally character sheets, **Give order** buttons (same action picker as narration quick actions) appear below the portrait when no order is pending. A pending order shows with a cancel control and hides the picker until cancelled. Orders execute when the player ends the turn; allies without an order default to collecting a resource at their current place when possible.

---

## Related Docs

- [game-design.md](./game-design.md) — Core loop, narration vs simulation, action widgets
