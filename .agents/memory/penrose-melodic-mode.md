---
name: Penrose melodic mode design
description: How the Penrose Music Generator's optional "Melodic / Interweave" mode was designed, and the pitfall that motivated the contour approach.
---

The project has a default "Geometric (raw mapping)" mode where each tile's geometric property maps directly to a note degree — this can feel monotonic (e.g. radial position always climbs outward), which is what prompted this feature.

Rule: when adding an alternate mode next to an established default, gate all new logic behind the mode flag and leave the default branch's math byte-for-byte identical. Don't refactor the shared code path "for consistency" — it risks silently changing default-mode output for existing users/presets.

**Why:** the user explicitly wanted the existing default mapping preserved unchanged while adding an opt-in alternative.

**How to apply:** in `musicMapping.ts`, `generateEventSequence` branches on `params.melodyMode`. The `"geometric"` branch still does `Math.round(rawDegree)` with no smoothing/state. Only `"melodicInterweave"` uses `melodicDegree()`.

Second lesson: naive "melodic smoothing" (just clamping the max interval jump toward a target value) is not enough to fix a monotonic contour — if the target itself is monotonic (e.g. always increasing with radius), a clamped walk toward it just climbs more slowly, it doesn't become melodic. Real melodic phrasing needs an oscillating component (a sine-wave "contour" added to the raw target, cycling every N notes) layered on top of the clamp, so the line rises and falls in phrases regardless of the underlying geometric trend. Two voices get contours in opposite phase (offset by π) so they move independently/contrapuntally instead of in lockstep.
