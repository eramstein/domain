# Time System

## Purpose

The Time System tracks the progression of time within the simulation.

Time is turn-based. Each turn represents a period of the day.

The Time System is responsible for:

- Tracking the current day and period
- Advancing time
- Converting simulation time into human-readable strings
- Providing a consistent temporal reference for all game systems

The Time System does not:

- Trigger gameplay events automatically
- Schedule character actions
- Manage seasons or weather

Those concerns belong to separate systems that may depend on Time.

---

# Terminology

## Day

A sequential simulation day starting at Day 1.

Day 1 corresponds to the configured simulation start date.

## Period

A subdivision of a day.

Supported periods:

- Morning
- Afternoon
- Evening
- Night

The order is fixed:

Morning → Afternoon → Evening → Night → Morning (next day)

## Turn

A single advancement of time.

Calling `passTurn()` advances the simulation by one period.

---

# Configuration

## Time Configuration

The game configuration must specify a simulation start date.

Example:

```ts
{
  startDate: '1404-01-01'
}

```

The game always begins on:

```ts
{
  day: 1,
  period: 'Morning'
}

```

---

# State

## GameTime

```ts
export type TimePeriod =
  | 'Morning'
  | 'Afternoon'
  | 'Evening'
  | 'Night';

export interface GameTime {
  day: number;
  period: TimePeriod;
}

```

## State Location

The Time System state is stored inside the global GameState.

Example:

```ts
interface GameState {
  time: GameTime;
}

```

---

# Rules

## Day Progression

Time advances according to the following sequence:


| Current   | Next                    |
| --------- | ----------------------- |
| Morning   | Afternoon               |
| Afternoon | Evening                 |
| Evening   | Night                   |
| Night     | Morning + increment day |


Example:

```text
Day 1 Morning
→ Day 1 Afternoon
→ Day 1 Evening
→ Day 1 Night
→ Day 2 Morning

```

---

# Engine API

## passTurn()

Advances the simulation by one period.

Signature:

```ts
passTurn(): void

```

Behavior:

- Advances to the next period
- If current period is Night:
  - set period to Morning
  - increment day by 1

Example:

```ts
{
  day: 3,
  period: 'Night'
}

```

becomes:

```ts
{
  day: 4,
  period: 'Morning'
}

```

---

## getTimeString()

Returns a human-readable representation of the current simulation date.

Signature:

```ts
getTimeString(): string

```

Behavior:

- Uses configured start date
- Converts current simulation day into a calendar date
- Includes weekday
- Includes month name
- Includes day number
- Includes year

Examples:

```text
Monday, Jan 1, 1404

```

```text
Tuesday, Jan 2, 1404

```

```text
Wednesday, Jan 3, 1404

```

Period is not included in the formatted string.

Period display is handled separately by the UI.

---

# Constraints

- Time must always contain a valid period.
- Day must always be greater than or equal to 1.
- The order of periods must remain fixed.
- Time calculations must be deterministic.
- No randomness may be introduced by the Time System.

