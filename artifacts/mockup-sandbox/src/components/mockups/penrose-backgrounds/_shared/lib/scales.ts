import type { ScaleName } from "./types";

export const SCALE_INTERVALS: Record<ScaleName, number[]> = {
  major: [0, 2, 4, 5, 7, 9, 11],
  naturalMinor: [0, 2, 3, 5, 7, 8, 10],
  harmonicMinor: [0, 2, 3, 5, 7, 8, 11],
  dorian: [0, 2, 3, 5, 7, 9, 10],
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  lydian: [0, 2, 4, 6, 7, 9, 11],
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  majorPentatonic: [0, 2, 4, 7, 9],
  minorPentatonic: [0, 3, 5, 7, 10],
  wholeTone: [0, 2, 4, 6, 8, 10],
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
};

export function degreeToNote(
  scale: ScaleName,
  rootNote: number,
  degree: number,
  low: number,
  high: number,
): number {
  const intervals = SCALE_INTERVALS[scale];
  const octaveSpan = intervals.length;
  const octave = Math.floor(degree / octaveSpan);
  const step = ((degree % octaveSpan) + octaveSpan) % octaveSpan;
  let note = rootNote + octave * 12 + intervals[step];

  const range = Math.max(1, high - low);
  while (note < low) note += 12;
  while (note > high) note -= 12;
  if (note < low || note > high) {
    note = Math.max(low, Math.min(high, low + (note % range)));
  }
  return note;
}

export function midiToNoteName(note: number): string {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const octave = Math.floor(note / 12) - 1;
  return `${names[note % 12]}${octave}`;
}

export const ROOT_NOTE_OPTIONS = Array.from({ length: 25 }, (_, i) => ({
  value: 36 + i,
  label: midiToNoteName(36 + i),
}));
