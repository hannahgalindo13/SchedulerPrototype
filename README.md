# Cadence

A functional React/Vite prototype for building a balanced weekly routine
around fixed commitments (classes, shifts, standing meetings) and goals
you want to fit in (studying, gym, hobbies).

This is an interactive port of an AI-generated design concept, with the
original visual design preserved across its three screens:

1. **Home** — the landing pitch and a preview of a "prioritized" week.
2. **Your inputs** — add fixed hours and goals, in priority order.
3. **Your week** — the generated schedule, with blocks you can tap to
   rename, move to another day, or resize.

## Running locally

```bash
npm install
npm run dev
```

## Building

```bash
npm run build
```

## How scheduling works

Fixed hours are placed on the calendar first and never move automatically.
Goals are then packed into the open time in priority order (top of the
list first), preferring the day with the least load so far and the time
window you picked for that goal. A goal session that can't find a clash-free
slot in its window is left unplaced, and the schedule screen tells you how
many. See `src/lib/scheduler.js` for the full algorithm.
