export type TileType = "kite" | "dart";

export interface Tile {
  id: string;
  type: TileType;
  vertices: [number, number][];
  center: [number, number];
  angle: number;
  depth: number;
  neighbors: string[];
}

export interface PenroseTiling {
  tiles: Tile[];
  depth: number;
}

export type TraversalMode =
  | "radial"
  | "spiral"
  | "row-scan"
  | "angle-sweep"
  | "adjacency-walk"
  | "depth-order";

export const TRAVERSAL_MODES: { value: TraversalMode; label: string }[] = [
  { value: "radial", label: "Radial (center outward)" },
  { value: "spiral", label: "Spiral" },
  { value: "row-scan", label: "Row Scan" },
  { value: "angle-sweep", label: "Angle Sweep" },
  { value: "adjacency-walk", label: "Adjacency Walk" },
  { value: "depth-order", label: "Depth Order" },
];

export type ScaleName =
  | "major"
  | "naturalMinor"
  | "harmonicMinor"
  | "dorian"
  | "phrygian"
  | "lydian"
  | "mixolydian"
  | "majorPentatonic"
  | "minorPentatonic"
  | "wholeTone"
  | "chromatic";

export const SCALE_NAMES: { value: ScaleName; label: string }[] = [
  { value: "major", label: "Major" },
  { value: "naturalMinor", label: "Natural Minor" },
  { value: "harmonicMinor", label: "Harmonic Minor" },
  { value: "dorian", label: "Dorian" },
  { value: "phrygian", label: "Phrygian" },
  { value: "lydian", label: "Lydian" },
  { value: "mixolydian", label: "Mixolydian" },
  { value: "majorPentatonic", label: "Major Pentatonic" },
  { value: "minorPentatonic", label: "Minor Pentatonic" },
  { value: "wholeTone", label: "Whole Tone" },
  { value: "chromatic", label: "Chromatic" },
];

export type MappingSource = "tileType" | "position" | "angle" | "adjacency";

export const MAPPING_SOURCES: { value: MappingSource; label: string }[] = [
  { value: "tileType", label: "Tile Type" },
  { value: "position", label: "Position" },
  { value: "angle", label: "Angle" },
  { value: "adjacency", label: "Adjacency Count" },
];

export interface MappingRules {
  noteSource: MappingSource;
  velocitySource: MappingSource;
  durationSource: MappingSource;
  panSource: MappingSource;
  sampleGroupSource: MappingSource;
}

export const DEFAULT_MAPPING: MappingRules = {
  noteSource: "position",
  velocitySource: "adjacency",
  durationSource: "tileType",
  panSource: "position",
  sampleGroupSource: "tileType",
};

export type MelodyMode = "geometric" | "melodicInterweave";

export const MELODY_MODES: { value: MelodyMode; label: string }[] = [
  { value: "geometric", label: "Geometric (raw mapping)" },
  { value: "melodicInterweave", label: "Melodic / Interweave" },
];

export interface GeneratorParams {
  depth: number;
  traversalMode: TraversalMode;
  tempo: number;
  scale: ScaleName;
  rootNote: number;
  noteRangeLow: number;
  noteRangeHigh: number;
  rhythmDensity: number;
  mapping: MappingRules;
  melodyMode: MelodyMode;
}

export const DEFAULT_PARAMS: GeneratorParams = {
  depth: 4,
  traversalMode: "radial",
  tempo: 84,
  scale: "minorPentatonic",
  rootNote: 57,
  noteRangeLow: 45,
  noteRangeHigh: 81,
  rhythmDensity: 0.55,
  mapping: DEFAULT_MAPPING,
  melodyMode: "geometric",
};

export interface MusicEvent {
  index: number;
  tileId: string;
  time: number;
  note: number;
  velocity: number;
  duration: number;
  pan: number;
  sampleGroup: number;
  voice: number;
}

export interface Preset {
  name: string;
  createdAt: string;
  params: GeneratorParams;
}
