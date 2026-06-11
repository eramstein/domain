# Time System

## Purpose

The Time system tracks the progression of time within the simulation.

Time is turn-based. Each turn represents one period of the day. The system provides a consistent temporal reference for all other systems and a human-readable calendar date for display.

The Time system is responsible for:

- Tracking the current simulation day and period
- Advancing time by one period when a turn completes
- Converting simulation day into a calendar date string for display

The Time system does not:

- Trigger gameplay events automatically
- Schedule character actions
- Manage seasons or weather
- Reset per-character turn budgets (see Actions system — triggered when time advances)

---

## Behavior

### Concepts

**Day** — A sequential simulation day starting at Day 1. Day 1 corresponds to the configured simulation start date.

**Period** — A subdivision of a day. Supported periods, in fixed order:

Morning → Afternoon → Evening → Night → (next day) Morning

**Turn** — One advancement of time. Advancing a turn moves the simulation forward by exactly one period.

### Configuration

The game configuration must specify a simulation start date (for example, `1404-01-01`).

A new game always begins at Day 1, Morning.

### State

The simulation holds:

- **day** — integer, minimum 1
- **period** — one of Morning, Afternoon, Evening, Night

### Day progression

| Current period | Next period              |
| -------------- | ------------------------ |
| Morning        | Afternoon                |
| Afternoon      | Evening                  |
| Evening        | Night                    |
| Night          | Morning (day increments) |

Example sequence:

```text
Day 1 Morning
→ Day 1 Afternoon
→ Day 1 Evening
→ Day 1 Night
→ Day 2 Morning
```

### Interface

**Advance turn** — Move the simulation forward by one period. When the current period is Night, set period to Morning and increment day by 1.

**Get calendar date string** — Return a human-readable representation of the current simulation date:

- Derived from the configured start date and current simulation day
- Includes weekday, month name, day number, and year
- Does not include the current period (period display is handled separately by the UI)

Example outputs for consecutive days:

```text
Monday, Jan 1, 1404
Tuesday, Jan 2, 1404
Wednesday, Jan 3, 1404
```

---

## Rules

- Time must always contain a valid period.
- Day must always be greater than or equal to 1.
- The order of periods is fixed and must not change.
- Time calculations must be deterministic — no randomness.

---

## Dependencies

**Consumed by:**

- **Actions** — Turn completion advances time and triggers turn-budget reset for all characters.
- **UI** — Displays the calendar date string and current period.

**Depends on:**

- Game configuration providing a simulation start date.

**Independent of:**

- Character actions, places, resources, and narration.

---

## Acceptance criteria

- A new game starts at Day 1, Morning.
- Advancing from Night increments the day and sets period to Morning.
- Advancing through a full day cycle (Morning → Afternoon → Evening → Night → Morning) increments the day exactly once.
- The calendar date string reflects the configured start date offset by the current simulation day.
- The calendar date string does not include the period.
- Time state is always valid (day ≥ 1, period is one of the four defined values).
