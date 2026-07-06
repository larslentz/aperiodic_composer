import type {
  GeneratorParams,
  MappingSource,
  MusicEvent,
  PenroseTiling,
  Tile,
} from "./types";
import { orderTiles } from "./traversal";
import { degreeToNote } from "./scales";

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
  for (const t of tiles) {
    const r = Math.sqrt(t.center[0] ** 2 + t.center[1] ** 2);
    if (r > max) max = r;
  }
  return max;
}

function sourceValue(
  tile: Tile,
  source: MappingSource,
  maxRadius: number,
  maxAdjacency: number,
): number {
  switch (source) {
    case "tileType":
      return tile.type === "kite" ? 0 : 1;
    case "position": {
      const r = Math.sqrt(tile.center[0] ** 2 + tile.center[1] ** 2);
      return maxRadius > 0 ? r / maxRadius : 0;
    }
    case "angle": {
      const a = Math.atan2(tile.center[1], tile.center[0]);
      return (a + Math.PI) / (Math.PI * 2);
    }
    case "adjacency":
      return maxAdjacency > 0 ? tile.neighbors.length / maxAdjacency : 0;
    default:
      return 0;
  }
}

export function generateEventSequence(
  tiling: PenroseTiling,
  params: GeneratorParams,
): MusicEvent[] {
  const ordered = orderTiles(tiling.tiles, params.traversalMode);
  const maxRadius = boundingRadius(tiling.tiles);
  const maxAdjacency = Math.max(1, ...tiling.tiles.map((t) => t.neighbors.length));

  const secondsPerBeat = 60 / params.tempo;
  const step = secondsPerBeat / 4; // sixteenth-note grid
  const events: MusicEvent[] = [];
  const degreeSpan = 21; // roughly 3 octaves of scale degrees

  ordered.forEach((tile, i) => {
    const gate = hashString(`${tile.id}:gate`);
    if (gate > params.rhythmDensity) return;

    const noteVal = sourceValue(
      tile,
      params.mapping.noteSource,
      maxRadius,
      maxAdjacency,
    );
    const velVal = sourceValue(
      tile,
      params.mapping.velocitySource,
      maxRadius,
      maxAdjacency,
    );
    const durVal = sourceValue(
      tile,
      params.mapping.durationSource,
      maxRadius,
      maxAdjacency,
    );
    const panVal = sourceValue(
      tile,
      params.mapping.panSource,
      maxRadius,
      maxAdjacency,
    );
    const groupVal = sourceValue(
      tile,
      params.mapping.sampleGroupSource,
      maxRadius,
      maxAdjacency,
    );

    const degree = Math.round(noteVal * degreeSpan);
    const note = degreeToNote(
      params.scale,
      params.rootNote,
      degree,
      params.noteRangeLow,
      params.noteRangeHigh,
    );
    const velocity = Math.round(40 + velVal * 87);
    const durationSteps = 1 + Math.round(durVal * 5);
    const duration = durationSteps * step;
    const pan = panVal * 2 - 1;
    const sampleGroup = Math.min(3, Math.floor(groupVal * 4));

    events.push({
      index: events.length,
      tileId: tile.id,
      time: i * step,
      note,
      velocity,
      duration,
      pan,
      sampleGroup,
    });
  });

  return events;
}
