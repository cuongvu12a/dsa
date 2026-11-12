# workout-plan — agent guide

A personal home-training plan delivered as an offline web page. The owner (Vietnamese speaker; reply to him in Vietnamese) opens `workout-plan.html` by double-clicking it. There is no build step, no server and no network dependency.

This file tells an agent what the project is, how the data is structured, which decisions are already settled, and how to make changes safely.

## Files

| Path | Role |
|---|---|
| `workout-plan.html` | UI: inline CSS + JS, SVG body model, tabs, cards, alternatives drawer. Holds no program data. |
| `exercises.js` | **All program data** (`window.WORKOUT_DATA`). Almost every change happens here. |
| `history/` | Snapshots of `exercises.js` plus `HISTORY.md` (changelog in Vietnamese). The page never loads these files. |
| `README.md` | This guide. |

Why the data file is `.js` and not `.json`: browsers block `fetch()` on `file://`, so a JSON file would not load when the page is opened by double-click. `exercises.js` is a plain `<script src>` that assigns one JSON-shaped object, so keep it valid JSON-like (no functions, no computed values).

## Client profile and hard constraints

- Male, 26, 166 cm, 66 kg, ~24% body fat, sedentary office job (8+ h sitting). About one month of consistent training (as of 2026-11).
- Goal: body recomposition. Priorities: broad shoulders (side delts), thick back (lats, mid back), chest, visible forearms (he wears short or rolled-up sleeves), defined core, balanced legs.
- Equipment: pull-up bar, **one light dumbbell**, floor, sturdy chair/sofa, towel. No gym. He chose **not** to use a weighted backpack; don't suggest it again unless he asks.
- Sessions: 30–45 min including a 5-minute warm-up, 5–7 exercises. Main compounds come first (3–4 sets), accessories after (2–3 sets), and antagonist supersets are used to save time.
- Progression is mainly via tempo and isometrics: slow eccentrics, then pauses, then 1½ reps, then a harder variation, at 0–2 RIR (reps in reserve).
- Schedule is a rotation, not fixed weekdays: **Upper A → Lower A → Upper B → Lower B → repeat**, about 4 sessions per 7–8 days. **Full-Body** is a fallback when only one session fits in 3–4 days. It is excluded from weekly volume.

## Current program (v2, 2026-11-11)

Both upper days share one template: vertical pull + horizontal push + horizontal pull + vertical push + delts + arms. They differ in exercise choice and emphasis. Arms go last on upper days. Abs and direct forearm work go on lower days.

| Session | Emphasis | Slots (default exercise, sets × reps) |
|---|---|---|
| Upper A | Chest | A1 Pull-Up 4×4–8 / A2 Feet-Elevated Push-Up 4×8–15 · B1 One-Arm DB Row 3×8–12 / B2 Pike Push-Up 3×6–10 · C Seated Lateral Raise 4×12–20 · D1 Supinated Curl 3×8–12 / D2 DB Overhead Triceps Ext 3×10–15 |
| Lower A | Quads | A Bulgarian Split Squat 4×8–12 · B1 Heel-Elevated Goblet Squat 3×10–15 / B2 Single-Leg Calf Raise 3×10–20 · C1 Eccentric Nordic 3×3–6 / C2 Hanging Knee Raise 3×8–15 · D1 Wrist Curl 2×15–20 / D2 Reverse Wrist Curl 2×15–20 |
| Upper B | Back + shoulders | A1 Chin-Up 4×5–10 / A2 Feet-Elevated Pike Push-Up 4×6–10 · B1 Wide-Elbow Row 3×10–15 / B2 Deficit Push-Up 4×8–15 · C1 Lean-Away Lateral Raise 4×12–20 / C2 Rear Delt Fly 3×12–20 · D Hammer Curl 3×8–12 |
| Lower B | Hip hinge | A Single-Leg DB RDL 4×8–12 · B1 Deficit Reverse Lunge 3×8–12 / B2 Towel Sliding Leg Curl 3×6–12 · C1 Seated Lateral Raise 3×12–20 / C2 Bent-Knee Calf Raise 3×12–20 · D1 Side Plank Hip Dips 3×8–12 / D2 DB Reverse Curl 3×10–15 |

Weekly **direct** sets (rotation only; indirect sets in parentheses): chest 8 (+7), front delts 11, side delts 11, rear delts 6, upper traps 0 (+21), lats 11, mid back 6 (+11), biceps 14 (pull-ups count as primary), triceps 10, forearms 10, abs 3 (+22), obliques 3, lower back 0 (+4), glutes 11, quads 10, hamstrings 10, calves 6.

### Settled decisions (from a 10-coach review, average score of v1 was 6.4/10)

These are already agreed with the owner. Don't reverse them without asking.

- Forearm isolation stays on **lower days**, as a flexor + extensor pair. Upper days already tire the grip before pull-ups.
- Upper A and Upper B must stay balanced. Each has a hard chest push, a vertical pull, a row and a vertical push.
- The light dumbbell can't load bilateral squats and RDLs, or a one-arm overhead press, well enough. So unilateral or leverage-based lifts are the mains: Bulgarian split squat, single-leg RDL and pike push-ups.
- Removed defaults:
  - Chair dip, because it loads the front of the shoulder.
  - One-arm overhead press.
  - Two-leg RDL as the main lift.
  - Single-leg hip thrust.
  - DB shrug.
  - Abs on Upper A.

  The first three are still selectable as alternatives in their pools. **Hip thrust and shrug are not in any slot's pool**, so add a pool entry if he wants them back.
- Known trade-offs he accepted: lower back has no direct work (he can swap Lower B's main lift to DB Romanian Deadlift), and upper traps get indirect work only. He picks easier variations himself (for example Split Squat or plain Push-Up) from the alternatives drawer.

## Data schema (`window.WORKOUT_DATA`)

```js
{
  meta: { title, subtitleVi, rotation: [sessionId...], fallback: sessionId, facts: [str], notes: [str] },
  muscles:   { <muscleId>: { en, vi } },                       // 17 groups, ids used everywhere
  exercises: { <exId>: { en, vi, primary: [muscleId], secondary: [muscleId],
                         level: 1..5,                          // absolute difficulty
                         hold?: "20–40s",                      // isometric: replaces the slot's reps
                         cue?:  "..." } },                     // replaces the slot's cue
  pools:     { <poolId>: [exId, ...] },                        // ranked BEST → WORST for hypertrophy
  sessions:  [ { id, en, vi, time, priority: [muscleId],
                 items: [ { pool, pick, role: "Main"|"Accessory", sets: n, reps: "8–12/side",
                            cue: "3s down, 1s pause", ss: "A1" } ] } ]
}
```

Muscle ids: `chest frontDelts sideDelts rearDelts traps lats midBack biceps triceps forearms abs obliques lowerBack glutes quads hamstrings calves`.

Rules the UI relies on:

- **`pick` must be an element of `pools[pool]`.** It is the default exercise for that slot.
- **Superset codes:** consecutive items sharing the letter in `ss` (A1, A2, A3) form one superset or tri-set block. A lone letter (`"D"`) means straight sets.
- **Display:** a card shows `${sets} × ${exercise.hold || item.reps}` and `exercise.cue || item.cue`.
- **Alternatives drawer:** it lists the whole pool in rank order. Each entry is tagged Easier, Harder or Similar by comparing its `level` with the current exercise's level.
- **Weekly volume** in the legend counts primary and secondary muscles × `sets` over `meta.rotation` sessions only.
- Exercise names in `en` are what he copies or searches on YouTube. The Copy and YouTube buttons strip parenthetical text, so keep the searchable name before any `( … )`.

## UI behaviour (workout-plan.html)

- Left side: SVG front and back body model plus the legend with weekly sets. Right side: session tabs and exercise cards.
- **Hovering a card** highlights its primary muscles (strong colour) and secondary muscles (light colour).
- **Hovering a muscle or legend row** highlights the cards that train it.
- **Clicking a card** opens the ranked alternatives drawer on the right (a bottom sheet on mobile). Choosing an option swaps it into the slot. Clicking outside or pressing Esc closes the drawer.
- **Swaps persist** in `localStorage` key `workoutPlan.picks.v1` as `{ "<sessionId>:<itemIndex>": exId }`. A saved pick is ignored if it is no longer in that slot's pool. Reordering items in a session therefore remaps or resets his swaps, so mention this when you reorder slots. The last tab is stored in `workoutPlan.tab.v1`.
- Body geometry (`SILHOUETTE`, `BODY`) lives in the HTML. Only left-side paths are defined, and they are mirrored at x = 200. Hidden regions are muscles that no current pick trains.

## How to change things

1. **Add an alternative:** add the exercise to `exercises` with `en`, `vi`, `primary`, `secondary` and `level`, then insert its id into the right `pools` list at its hypertrophy rank.
2. **Change a session:** edit `sessions[].items`. Keep 5–7 exercises and the 30–45 min cap. Lower-body single-leg work takes double time.
3. **Validate** (run from this folder):
   ```bash
   node -e 'global.window={};require("./exercises.js");const D=window.WORKOUT_DATA;let bad=0;
   for(const s of D.sessions)for(const it of s.items){const P=D.pools[it.pool];if(!P||!P.includes(it.pick)){console.log("bad slot",s.id,it.pick);bad++}}
   for(const [p,ids] of Object.entries(D.pools))for(const id of ids)if(!D.exercises[id]){console.log("missing",p,id);bad++}
   for(const [id,e] of Object.entries(D.exercises))for(const m of [...e.primary,...e.secondary])if(!D.muscles[m]){console.log("bad muscle",id,m);bad++}
   console.log("problems:",bad)'
   ```
4. **Record history (required):** copy the new `exercises.js` to `history/YYYY-MM-DD_vN_<short-name>.js` and add a section at the top of `history/HISTORY.md` in Vietnamese. The section lists what changed per session and the before → after weekly direct sets.
5. To check the page visually, headless Chrome works: `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --window-size=1440,900 --screenshot=out.png file://$PWD/workout-plan.html`. Headless Chrome won't go below 500 px wide, and its clipboard is blocked, so "Copy failed" there is expected.

Before restructuring the plan, ask the owner. He reviews changes and has rolled decisions into the current version deliberately.
