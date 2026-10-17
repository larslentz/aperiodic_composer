import type { GeneratorParams, MappingSource, MusicEvent, PenroseTiling, Tile } from "./types";
import { orderTiles } from "./traversal";
import { degreeToNote } from "./scales";

type MusicalRhythmSlot = {
  durationSteps: number;
  optional?: boolean;
  accent?: "strong" | "light";
};

const MUSICAL_STEPS_PER_BAR = 16;
const MUSICAL_RHYTHM_BARS: (MusicalRhythmSlot | null)[][] = [
  [
    { durationSteps: 4, accent: "strong" }, null, null, null,
    { durationSteps: 2, optional: true, accent: "light" }, null, null, null,
    { durationSteps: 4, accent: "strong" }, null, null, null,
    { durationSteps: 2, optional: true, accent: "light" }, null, null, null,
  ],
  [
    { durationSteps: 3, accent: "strong" }, null, null,
    { durationSteps: 1, optional: true, accent: "light" }, null, null, null, null,
    { durationSteps: 4, accent: "strong" }, null, null, null,
    { durationSteps: 2, optional: true, accent: "light" }, null, null, null,
  ],
];

const MUSICAL_DEGREE_MOTIF = [0, 2, 4, 2, 1, 3, 5, 3, 2, 4, 3, 1, 2, 1, 0, 0];

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

function boundingRadius(tiles: Tile[]): number {
  let max = 1;
  for (const tile of tiles) {
    const radius = Math.sqrt(tile.center[0] ** 2 + tile.center[1] ** 2);
    if (radius > max) max = radius;
  }
  return max;
}

function melodicDegree(
  prevDegree: number | null,
  rawDegree: number,
  voiceStep: number,
  phaseOffset: number,
  phraseLen: number,
  contourAmplitude: number,
  maxIntervalJump: number,
): number {
  const contour = Math.sin((voiceStep / phraseLen) * Math.PI * 2 + phaseOffset) * contourAmplitude;
  const target = rawDegree + contour;
  if (prevDegree === null) return Math.round(target);
  const delta = target - prevDegree;
  const clamped = Math.max(-maxIntervalJump, Math.min(maxIntervalJump, delta));
  return Math.round(prevDegree + clamped);
}

function sourceValue(tile: Tile, source: MappingSource, maxRadius: number, maxAdjacency: number): number {
  switch (source) {
    case "tileType":
      return tile.type === "kite" ? 0 : 1;
    case "position": {
      const radius = Math.sqrt(tile.center[0] ** 2 + tile.center[1] ** 2);
      return maxRadius > 0 ? radius / maxRadius : 0;
    }
    case "angle": {
      const angle = Math.atan2(tile.center[1], tile.center[0]);
      return (angle + Math.PI) / (Math.PI * 2);
    }
    case "adjacency":
      return maxAdjacency > 0 ? tile.neighbors.length / maxAdjacency : 0;
    default:
      return 0;
  }
}

export function generateEventSequence(tiling: PenroseTiling, params: GeneratorParams): MusicEvent[] {
  const ordered = orderTiles(tiling.tiles, params.traversalMode);
  const maxRadius = boundingRadius(tiling.tiles);
  const maxAdjacency = Math.max(1, ...tiling.tiles.map((tile) => tile.neighbors.length));
  const step = (60 / params.tempo) / 4;
  const events: MusicEvent[] = [];
  const degreeSpan = 21;
  const interweave = params.melodyMode === "melodicInterweave";
  const musical = params.melodyMode === "musical";
  const phraseLen = params.contourPhraseLen ?? 16;
  const contourAmplitude = params.contourAmplitude ?? 4;
  const maxIntervalJump = params.maxIntervalJump ?? 2;
  const voicePrevDegree: (number | null)[] = [null, null];
  const voiceStepCounters = [0, 0];
  const voiceTimeCounters = [0, 0];

  ordered.forEach((tile, i) => {
    const musicalBarIndex = Math.floor(i / MUSICAL_STEPS_PER_BAR);
    const musicalSlotIndex = i % MUSICAL_STEPS_PER_BAR;
    const musicalSlot = musical
      ? MUSICAL_RHYTHM_BARS[musicalBarIndex % MUSICAL_RHYTHM_BARS.length][musicalSlotIndex]
      : null;

    if (musical) {
      if (!musicalSlot) return;
      if (musicalSlot.optional && hashString(`${tile.id}:musical-fill`) > params.rhythmDensity) return;
    } else if (hashString(`${tile.id}:gate`) > params.rhythmDensity) {
      return;
    }

    const noteVal = sourceValue(tile, params.mapping.noteSource, maxRadius, maxAdjacency);
    const velVal = sourceValue(tile, params.mapping.velocitySource, maxRadius, maxAdjacency);
    const durVal = sourceValue(tile, params.mapping.durationSource, maxRadius, maxAdjacency);
    const panVal = sourceValue(tile, params.mapping.panSource, maxRadius, maxAdjacency);
    const groupVal = sourceValue(tile, params.mapping.sampleGroupSource, maxRadius, maxAdjacency);
    const rawDegree = noteVal * degreeSpan;
    const voice = interweave ? (tile.type === "kite" ? 0 : 1) : 0;

    let degree: number;
    if (interweave) {
      degree = melodicDegree(
        voicePrevDegree[voice],
        rawDegree,
        voiceStepCounters[voice],
        voice === 0 ? 0 : Math.PI,
        phraseLen,
        contourAmplitude,
        maxIntervalJump,
      );
      voicePrevDegree[voice] = degree;
      voiceStepCounters[voice] += 1;
    } else if (musical && musicalSlot) {
      const phraseStep = Math.floor(i / 4) % MUSICAL_DEGREE_MOTIF.length;
      const geometryVariation = phraseStep === MUSICAL_DEGREE_MOTIF.length - 1
        ? 0
        : Math.round(noteVal * 2) - 1;
      degree = MUSICAL_DEGREE_MOTIF[phraseStep] + geometryVariation;
    } else {
      degree = Math.round(rawDegree);
    }

    const note = degreeToNote(params.scale, params.rootNote, degree, params.noteRangeLow, params.noteRangeHigh);
    const baseVelocity = Math.round(40 + velVal * 87);
    const accentOffset = musicalSlot?.accent === "strong" ? 16 : musicalSlot?.accent === "light" ? -12 : 0;
    const velocity = Math.max(1, Math.min(127, baseVelocity + accentOffset));
    const durationSteps = musicalSlot?.durationSteps ?? 1 + Math.round(durVal * 5);
    const duration = durationSteps * step;
    let pan = panVal * 2 - 1;
    let sampleGroup = Math.min(3, Math.floor(groupVal * 4));
    if (interweave) {
      pan = Math.max(-1, Math.min(1, pan * 0.6 + (voice === 0 ? -0.3 : 0.3)));
      sampleGroup = (sampleGroup + voice * 2) % 4;
    }

    let time: number;
    if (interweave) {
      time = voiceTimeCounters[voice];
      voiceTimeCounters[voice] += step;
    } else {
      time = i * step;
    }
    events.push({ index: events.length, tileId: tile.id, time, note, velocity, duration, pan, sampleGroup, voice });
  });

  events.sort((a, b) => a.time - b.time);
  events.forEach((event, i) => { event.index = i; });
  return events;
}
