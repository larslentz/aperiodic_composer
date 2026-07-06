# Penrose Music Generator

An installable, local-first PWA that generates Penrose-inspired quasi-periodic tilings and converts them into exportable musical event sequences (MIDI, CSV, JSON preset) for ambient/experimental composers.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the shared API server (port 5000, unused by this artifact so far)
- `pnpm --filter @workspace/penrose-music-generator run dev` — run the Penrose Music Generator frontend
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite, Tailwind, shadcn/ui
- PWA: `vite-plugin-pwa` (manifest + service worker + offline shell caching)
- Audio: native Web Audio API (oscillator-based synth, no samples)
- API/DB: not used by this artifact — it is 100% client-side by design

## Where things live

- `artifacts/penrose-music-generator/src/lib/penrose.ts` — Penrose (P2 kite/dart triangle) tiling generator via recursive deflation
- `artifacts/penrose-music-generator/src/lib/traversal.ts` — tile ordering strategies (radial, spiral, row-scan, angle-sweep, adjacency-walk, depth-order)
- `artifacts/penrose-music-generator/src/lib/scales.ts` — musical scale definitions and degree-to-MIDI-note mapping
- `artifacts/penrose-music-generator/src/lib/musicMapping.ts` — converts a tiling + `GeneratorParams` into a `MusicEvent[]` sequence
- `artifacts/penrose-music-generator/src/lib/audioEngine.ts` — Web Audio playback engine (oscillator synth, per-event pan/envelope)
- `artifacts/penrose-music-generator/src/lib/midiExport.ts`, `csvExport.ts`, `presetExport.ts` — file export/import (MIDI built manually as raw SMF bytes, no external MIDI library)
- `artifacts/penrose-music-generator/vite.config.ts` — PWA manifest/service worker config

## Architecture decisions

- No backend/database: all generation, mapping, playback, and export happens client-side; state is in-memory only and persists solely via user-exported/imported files (JSON preset).
- Penrose tiles are represented as individual triangles (kite/dart halves) rather than merged rhombi — simpler adjacency/neighbor computation while still producing an authentic quasi-periodic P2 tiling.
- MIDI files are hand-encoded as raw Standard MIDI File bytes (format 0) rather than pulling in a MIDI-writing dependency, keeping the export path dependency-free.

## Product

- Generate a Penrose tiling at a chosen recursion depth, visualize it live, and traverse it with a selectable strategy to produce a musical event sequence.
- Map tile type / position / angle / adjacency independently to MIDI note, velocity, duration, pan, and sample trigger group.
- Play the sequence in-browser via simple Web Audio synth tones.
- Export the sequence as a MIDI file, CSV event list, or JSON preset (and re-import presets).
- Installable as a PWA with offline shell support.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- The Penrose generator's tile count grows fast with depth (~10 × 2.1^depth); depth is clamped to 1-6 in the UI to keep visualization and event generation responsive.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
