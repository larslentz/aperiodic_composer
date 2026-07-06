---
name: Radix Select dropdown scroll
description: shadcn/Radix Select long lists can silently fail to scroll (wheel does nothing) even though the DOM has all options and the popper CSS looks correct.
---

The default shadcn `SelectContent` sets `max-h-[--radix-select-content-available-height]` on the popper content. That CSS variable is computed at runtime by Radix from collision/viewport measurements. In some embedding contexts (e.g. the app running inside a canvas iframe) it can fail to resolve to a usable value, leaving the content effectively unbounded/mis-sized so `overflow-y-auto` never kicks in — the dropdown renders and lists all options in the DOM, but mouse-wheel scrolling does nothing.

**Why:** Relying solely on the dynamic CSS var is fragile across embedding/viewport contexts; a test that only checks "the option exists in the DOM" or "the list looks scrollable" will pass even when real wheel-scroll interaction is broken — this required a rigorous test that dispatches actual wheel events and checks whether far-down options become visible only after scrolling.

**How to apply:** Give `SelectContent` (and any other Radix popper-based list: dropdown-menu, context-menu, etc.) a hard fallback max-height, e.g. `max-h-[min(24rem,var(--radix-select-content-available-height,24rem))]`, so the container always has a bounded height and `overflow-y-auto` reliably works even if the CSS var never resolves. When verifying scroll fixes with an automated test, assert on visibility of a specific far-list item before/after a real wheel-scroll gesture — don't trust a test that only confirms DOM presence.
