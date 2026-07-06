import type { MusicEvent } from "./types";

const PPQ = 480;

function writeVarLen(value: number): number[] {
  let buffer = value & 0x7f;
  const bytes: number[] = [];
  while ((value >>= 7) > 0) {
    buffer <<= 8;
    buffer |= 0x80 | (value & 0x7f);
  }
  while (true) {
    bytes.push(buffer & 0xff);
    if (buffer & 0x80) buffer >>= 8;
    else break;
  }
  return bytes;
}

function u32(n: number): number[] {
  return [(n >> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

function u16(n: number): number[] {
  return [(n >> 8) & 0xff, n & 0xff];
}

interface RawMidiEvent {
  tick: number;
  bytes: number[];
  order: number;
}

export function buildMidiFile(events: MusicEvent[], tempoBpm: number): Uint8Array {
  const ticksPerSecond = (PPQ * tempoBpm) / 60;
  const raw: RawMidiEvent[] = [];
  let order = 0;

  const microsecondsPerBeat = Math.round(60000000 / tempoBpm);
  raw.push({
    tick: 0,
    bytes: [
      0xff,
      0x51,
      0x03,
      (microsecondsPerBeat >> 16) & 0xff,
      (microsecondsPerBeat >> 8) & 0xff,
      microsecondsPerBeat & 0xff,
    ],
    order: order++,
  });

  const usedChannels = new Set<number>();
  for (const evt of events) {
    const channel = (evt.voice * 4 + evt.sampleGroup) % 16;
    usedChannels.add(channel);
    const onTick = Math.round(evt.time * ticksPerSecond);
    const offTick = Math.round((evt.time + evt.duration) * ticksPerSecond);
    const panValue = Math.max(0, Math.min(127, Math.round((evt.pan + 1) * 63.5)));

    raw.push({
      tick: onTick,
      bytes: [0xb0 | channel, 0x0a, panValue],
      order: order++,
    });
    raw.push({
      tick: onTick,
      bytes: [0x90 | channel, evt.note & 0x7f, evt.velocity & 0x7f],
      order: order++,
    });
    raw.push({
      tick: offTick,
      bytes: [0x80 | channel, evt.note & 0x7f, 0],
      order: order++,
    });
  }

  raw.sort((a, b) => a.tick - b.tick || a.order - b.order);

  const trackBytes: number[] = [];
  let lastTick = 0;
  for (const evt of raw) {
    const delta = Math.max(0, evt.tick - lastTick);
    trackBytes.push(...writeVarLen(delta));
    trackBytes.push(...evt.bytes);
    lastTick = evt.tick;
  }
  trackBytes.push(0x00, 0xff, 0x2f, 0x00); // end of track

  const header = [
    0x4d,
    0x54,
    0x68,
    0x64, // "MThd"
    ...u32(6),
    ...u16(0), // format 0
    ...u16(1), // one track
    ...u16(PPQ),
  ];

  const track = [
    0x4d,
    0x54,
    0x72,
    0x6b, // "MTrk"
    ...u32(trackBytes.length),
    ...trackBytes,
  ];

  void usedChannels;
  return new Uint8Array([...header, ...track]);
}

export function downloadMidiFile(
  events: MusicEvent[],
  tempoBpm: number,
  filename = "penrose-sequence.mid",
) {
  const bytes = buildMidiFile(events, tempoBpm);
  const blob = new Blob([bytes.slice().buffer], { type: "audio/midi" });
  triggerDownload(blob, filename);
}

export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
