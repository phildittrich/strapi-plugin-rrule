<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.png">
    <source media="(prefers-color-scheme: light)" srcset="assets/logo-light.png">
    <img alt="strapi-plugin-rrule logo" src="assets/logo-light.png" width="300">
  </picture>
</p>

<h1 align="center">strapi-plugin-rrule</h1>

<p align="center">A Strapi v5 custom field plugin for managing recurrence rules (RFC 5545) for events and schedules.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@opkod-france/strapi-plugin-rrule"><img src="https://img.shields.io/npm/v/@opkod-france/strapi-plugin-rrule.svg" alt="npm version"></a>
  <a href="https://github.com/opkod-france/strapi-plugin-rrule/actions/workflows/release.yml"><img src="https://github.com/opkod-france/strapi-plugin-rrule/actions/workflows/release.yml/badge.svg" alt="CI"></a>
  <a href="https://github.com/opkod-france/strapi-plugin-rrule/blob/main/LICENSE"><img src="https://img.shields.io/npm/l/@opkod-france/strapi-plugin-rrule.svg" alt="License"></a>
</p>

## Features

- Custom field for defining recurrence rules using the [RRule standard](https://datatracker.ietf.org/doc/html/rfc5545)
- Supports daily, weekly, monthly, and yearly frequencies
- Configurable end conditions (count, until date, or never)
- Weekday selection for weekly rules
- Monthly options (by day of month or by weekday position)
- Live preview of upcoming occurrences
- Stored as JSON for easy server-side processing

## Installation

```bash
yarn add @opkod-france/strapi-plugin-rrule
```

## Usage

1. Install the plugin in your Strapi v5 project
2. In the Content-Type Builder, add a new **Custom** field
3. Select **Recurrence Rule** from the list
4. Configure the field options as needed

## Data Format

The custom field stores its value as a **JSON object** in the database (Strapi `json` column type). Every mutation in the admin panel produces a complete snapshot of the rule configuration alongside a pre-computed RFC 5545 `RRULE` string.

### Schema

```typescript
interface RRuleValue {
  freq: number;          // Frequency: 0=Yearly, 1=Monthly, 2=Weekly, 3=Daily
  interval: number;      // Repeat every N periods (≥ 1)
  byweekday?: number[];  // Selected weekdays: 0=Mon … 6=Sun (weekly rules)
  bymonthday?: number[]; // Day(s) of the month, e.g. [15] (monthly rules)
  bymonth?: number[];    // Month(s) of the year, e.g. [1] for January (yearly rules)
  bysetpos?: number[];   // Position in set, e.g. [1]=first, [-1]=last (monthly "nth weekday" rules)
  dtstart?: string;      // Start date (ISO 8601)
  until?: string;        // End date (ISO 8601) — mutually exclusive with count
  count?: number;        // Max occurrences — mutually exclusive with until
  tzid: string;          // IANA timezone, e.g. "Europe/Paris"
  wkst?: number;         // Week start day (0=Mon … 6=Sun)
  rruleString: string;   // Pre-computed RFC 5545 RRULE string
}
```

### Example: Weekly on Mon/Wed/Fri

```json
{
  "freq": 2,
  "interval": 1,
  "byweekday": [0, 2, 4],
  "tzid": "Europe/Paris",
  "rruleString": "FREQ=WEEKLY;INTERVAL=1;BYDAY=MO,WE,FR"
}
```

### Example: Monthly on the last Friday, 5 occurrences

```json
{
  "freq": 1,
  "interval": 1,
  "bysetpos": [-1],
  "byweekday": [4],
  "count": 5,
  "tzid": "America/New_York",
  "rruleString": "FREQ=MONTHLY;INTERVAL=1;BYDAY=FR;BYSETPOS=-1;COUNT=5"
}
```

### How the component works internally

1. **Initialization** — When the field is empty, the component creates a default value (weekly on Monday, interval 1, user's local timezone).
2. **State updates** — Each UI interaction (frequency change, weekday toggle, etc.) calls an action function from `rruleActions.ts` that returns a **new immutable `RRuleValue`** with the `rruleString` automatically regenerated.
3. **Persistence** — The full JSON object is passed to Strapi's `onChange` handler, which stores it in the database. This means both the structured parameters and the ready-to-use RRULE string are always in sync and available via the API.

### Using the RRULE string server-side

The `rruleString` field is a standard RFC 5545 RRULE string that can be parsed by any compliant library:

```javascript
import { RRule } from 'rrule';

// From your Strapi API response
const entry = await strapi.documents('api::event.event').findOne({ documentId });
const { rruleString, dtstart } = entry.recurrence;

// Expand occurrences
const rule = RRule.fromString(`RRULE:${rruleString}`);
const next10 = rule.all((_, i) => i < 10);
```

## License

MIT
