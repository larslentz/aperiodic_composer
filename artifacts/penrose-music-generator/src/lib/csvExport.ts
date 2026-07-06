import type { MusicEvent } from "./types";
import { midiToNoteName } from "./scales";
import { triggerDownload } from "./midiExport";

export function buildEventCsv(events: MusicEvent[]): string {
  const header = [
    "index",
    "tileId",
    "time_sec",
    "note",
    "noteName",
    "velocity",
    "duration_sec",
    "pan",
    "sampleGroup",
  ];
  const rows = events.map((e) =>
    [
      e.index,
      e.tileId,
      e.time.toFixed(4),
      e.note,
      midiToNoteName(e.note),
      e.velocity,
      e.duration.toFixed(4),
      e.pan.toFixed(3),
      e.sampleGroup,
    ].join(","),
  );
  return [header.join(","), ...rows].join("\n");
}

export function downloadEventCsv(
  events: MusicEvent[],
  filename = "penrose-events.csv",
) {
  const csv = buildEventCsv(events);
  const blob = new Blob([csv], { type: "text/csv" });
  triggerDownload(blob, filename);
}
