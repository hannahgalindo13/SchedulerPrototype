# Cadence

A prototype for quickly building a balanced weekly routine around fixed
commitments (classes, shifts) and personal goals (gym, hobbies, etc.).

## The Need

Among all of their other activities, including during life changes like new
semesters in college or new jobs, young adults want to quickly have a new
routine but stress easily about new environments or changes to previous
schedules and don't know how to quickly establish their optimal routine.

## The Persona

Started a new semester, has classes and work at new times, wants to balance
all aspects of their lives, and needs to have a routine set quickly to feel
adjusted or productive.

## The Capability

Create a schedule quickly that takes into account all of their daily/weekly
goals.

## The Value

Stability. A good, prioritized schedule can be created instantly, without
the user having to stress over timing or consider all the other factors,
allowing them to get into a productive flow quickly.

## The Three Screens

| Screen | Job | Why it earned a slot | Design question |
|---|---|---|---|
| **1. Home** | Invite the user to "Get Started" and communicate the value of quickly establishing a stable routine. | This is the landing screen and gives the user an immediate understanding of the purpose and value of the product before they begin. | How can the home page make the user feel ready to begin creating their routine while communicating the value of stability? |
| **2. Schedule & Goals Input** | Invite the user to input any set schedules, such as classes and work, as well as any goals they would like to fit in, such as exercise and hobbies. | This screen demonstrates how the user provides the information the product needs to create a personalized routine. | How can the user easily input everything they need to balance into their routine? |
| **3. Generated Schedule** | Generate the user's Monday–Friday schedule, with the opportunity to edit it. | This screen demonstrates the primary capability and shows the user the main value of having their responsibilities and goals organized into a routine. | How can the generated schedule give the user a good starting point while still allowing them to make changes? |

## Feedback Questions & Predictions

These are predictions for how a first-time user might respond — not actual
user-testing results.

| Focus | Question | Prediction | Prototype element |
|---|---|---|---|
| **Need** | When was the last time you were trying to reorganize your schedule and how did you do it? | They will mention whatever time they adjusted to a new routine or desired routine and will describe manually moving things around, using a calendar (physical or digital), notes, or another workaround. | Screen 2 — "Fixed hours" + "Goals to fit in" |
| **Value** | What would you need to have to consider using a different solution instead of what you do currently? | They'll want something that makes the scheduling decision feel almost instantaneous and optimized, without requiring much manual analysis. | Screen 1 — "Tell us your fixed hours and the goals you want to keep. Get a balanced week in about two minutes." + Screen 3 — generated schedule |
| **Persona** | Who else do you know that deals with this issue? | They'll mention other students, roommates, or friends who have wanted to try new hobbies. | Screen 2 — Fixed hours + goals |
| **Capability** | I'll show you this screen for five seconds. (Turn it off.) What does this product do? | They'll say it builds a personalized schedule for you. | Screen 1 — landing page |

## Revision: Before and After

The original AI-generated prototype color-coded the blocks on the Schedule
screen (a dark bar for fixed commitments, a green bar for goals), but never
explained what the colors meant on that screen. The only place that
distinction was ever labeled was a small "Fixed" / "Your goals" key
underneath the decorative preview graphic on the Home screen — so by the
time a user actually reached their real schedule, that key was gone. This
is a signaling and comprehension problem: the whole point of the product
is that it prioritizes fixed commitments over goals, but a user looking at
their generated week had to infer or remember what each color meant instead
of being told.

**Before:** Schedule screen — color-coded blocks, no legend anywhere on
the screen.

Original AI-generated commit: https://github.com/hannahgalindo13/SchedulerPrototype/commit/8b42b99

**After:** Schedule screen — a "KEY" row with "Fixed" and "Your goals"
placed directly above the calendar grid, inside the same bordered card as
the grid itself, using the exact colors already established (no new
aesthetic direction).

This is a **proximity** and **common region** fix: the legend sits right
next to the thing it explains, inside the same visual container, so a
first-time user can connect the colors to their meaning without having to
remember anything from an earlier screen.

## Design Justification & First Read

- **Does the landing screen signal primary capability and value at first
  glance?** Yes. The dominant sentence on the page — "Tell us your fixed
  hours and the goals you want to keep. Get a balanced week in about two
  minutes." — is the largest, highest-contrast text on the screen and
  states both what the user does and what they get.
- **Does every landing element earn its place, or does anything compete
  with the primary job?** Yes. Every element on the page supports the same
  message instead of pulling attention from it — the preview graphic
  reinforces the same "prioritized week" idea rather than competing with
  it, and the CTA is the clear next step. The three-column blurb section
  below the fold mostly repeats the same value in different words rather
  than adding new information, but because it's secondary and placed below
  the fold, after the primary message and CTA, it doesn't compete with the
  primary job.
- **What belongs together on each screen, and which Gestalt principle
  shows it?** On Screen 2, the "Fixed hours" fields/list and the "Goals to
  fit in" fields/list are each grouped in their own bordered card —
  **common region**. On Screen 3, the legend and calendar are grouped by
  **proximity** and **common region** (same card), and the block-editing
  panel and weekly tally are each their own card in the sidebar, also by
  **common region**.
- **Do Screens 2 and 3 stay on mission?** Yes — Screen 2 actually collects
  the fixed hours and goals used to build the schedule, and Screen 3 runs
  a real placement algorithm and lets you edit the result. Neither is just
  decorating the landing page's pitch.
- **Can the user return to the landing screen from everywhere?** Yes — the
  header (logo + "Start") is present and clickable on all three screens.
- **What did the AI initially get wrong, skip, or oversimplify?** It built
  the color-coding system for fixed-vs-goal blocks but only explained that
  system once, on the Home screen's decorative preview — it never carried
  the explanation over to the actual working schedule.
- **What did I change, and why?** I added the same "Fixed" / "Your goals"
  key to the Schedule screen, placed directly above the grid in the same
  card, so the encoding is explained where it's actually used.
- **Which design question motivated the change?** Screen 3's design
  question — "How can the generated schedule give the user a good starting
  point while still allowing them to make changes?" — has two parts. The
  legend addresses the first part: it makes the generated schedule easier
  to understand as a genuinely prioritized starting point, rather than
  just a grid of blocks. The second part — the ability to make changes —
  is handled separately, by the existing block-editing controls (tapping a
  block to rename it, move it to another day, or resize it), which the
  legend doesn't change.
