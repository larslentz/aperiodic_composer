---
name: Penrose melodic mode design
description: Design lessons for the Penrose Music Generator's optional multi-voice / smoothed melody mode, and pitfalls that were missed on first pass.
---

When adding an alternate generation mode next to an established default, gate all new logic behind the mode flag and leave the default branch's math untouched. Don't refactor the shared code path "for consistency" — it risks silently changing default-mode output for existing users/presets.

**Why:** the user explicitly wanted the existing default mapping preserved unchanged while adding an opt-in alternative.

**How to apply:** branch early on the mode flag; the default branch should stay byte-for-byte identical to what it did before the feature existed.

Two lessons learned the hard way (code review caught the second one after initial "done"):

1. Naive "melodic smoothing" — just clamping the max interval jump toward a target value — does not fix a monotonic contour. If the target itself is monotonic (e.g. always increasing with radial position), a clamped walk toward it just climbs more slowly. Real melodic phrasing needs an oscillating component (a periodic contour cycling every N notes) layered on top of the raw target, so the line rises and falls in phrases regardless of the underlying geometric trend.

2. "Multiple voices" is not just tagging events with a voice ID while still deriving every event's time from one shared global counter/index. That produces voices that never rhythmically overlap the way independent parts would — each voice needs its own time cursor, advanced only when *that* voice emits an event, so voices can genuinely overlap/interleave in time. Merge and re-sort the combined event list by time afterward for correct downstream playback/export ordering.
