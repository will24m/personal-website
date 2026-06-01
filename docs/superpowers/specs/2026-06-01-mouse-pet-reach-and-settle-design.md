# Mouse Pet: Guaranteed Reach + Settle-Beside + Faster

**Date:** 2026-06-01
**File touched:** `src/hooks/usePetBrain.ts` only.

## Goal

Make the mouse pet:

1. **Always reach the cursor** when the cursor is *not* hovering over an
   interactive/blocking component. It squeezes through and slightly nudges
   movable components to get there.
2. **Settle beside the cursor, never block it.** Once it arrives, it rests
   just shy of the cursor — hugging it from the direction it traveled in
   (close enough that its arm grazes the pointer), never landing on the exact
   cursor point.
3. **Move 40% faster** than current.

## Behavior decisions (from user)

- Nudged components **spring back** after the pet passes (already the current
  CSS-driven behavior via `--pet-nudge-*` and `.pet-soft-obstacle`).
- Settle point: the pet stops near the cursor from **whatever direction it
  travelled from** — not a fixed offset. Super close, arm can touch. It must
  never cover the exact pointer.

## Changes

### 1. Speed (×1.4 on maxSpeed and acceleration)

| Config            | maxSpeed | acceleration |
|-------------------|----------|--------------|
| MOVEMENT_FOLLOW   | 91→127   | 312→437      |
| MOVEMENT_EXCITED  | 110→154  | 360→504      |
| MOVEMENT_POUNCE   | 125→175  | 408→571      |
| MOVEMENT_WANDER   | 70→98    | 264→370      |

Acceleration scales too so the higher top speed is actually reachable.

### 2. Settle-beside-the-cursor

New constant `SETTLE_OFFSET = 36` (px).

When the pet's follow target is the live cursor (states GREETING / FOLLOWING /
EXCITED / POUNCING / PLAYING, i.e. not WANDERING/SLEEPING) **and** the pet is
within an arrival radius of the cursor, replace the raw cursor target with a
point offset back along the pet→cursor approach direction:

```
settleTarget = cursor - approachDir * SETTLE_OFFSET
```

where `approachDir` is the unit vector from the pet toward the cursor. This
places the rest point on the side the pet came from, so the pet stops shy of
the cursor and never overlaps the exact pointer. Computed in the movement
frame (which has live pet + cursor positions) so it tracks the cursor as it
drifts.

This is applied as a target adjustment in the steering frame, keeping the
existing state machine untouched. When far from the cursor, behavior is
unchanged (head straight for it).

### 3. Guaranteed reach when cursor is in open space

The code already escalates routing: hard route → squeeze route
(`relaxedObstacles`) → emergency straight-line (`movementObstacles = []`).
Firm up the guarantee: when the cursor is **not** over an interactive/blocking
element and normal routing is making no meaningful progress, fall back to the
straight-line approach so the pet always closes the gap. When the cursor *is*
over a blocking element, the pet respects it and waits nearby (matches the
user's "if the mouse isn't hovering over a component" wording).

We detect "cursor over a blocking element" from the existing obstacle set:
if the live cursor document point lies inside any non-shiftable obstacle's
base rect, the pet does not force its way on top — it settles at the nearest
reachable point. Otherwise the emergency direct route is permitted.

Nudges (spring-back) stay active throughout the approach.

## Out of scope

- No changes to `VirtualPet.tsx` or CSS.
- No new states or relationship/bond logic.
