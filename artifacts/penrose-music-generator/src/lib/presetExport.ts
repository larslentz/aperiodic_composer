import type { GeneratorParams, Preset } from "./types";
import { DEFAULT_PARAMS, DEFAULT_MAPPING } from "./types";
import { triggerDownload } from "./midiExport";

export function buildPreset(name: string, params: GeneratorParams): Preset {
  return { name, createdAt: new Date().toISOString(), params };
}

export function downloadPreset(
  name: string,
  params: GeneratorParams,
  filename = "penrose-preset.json",
) {
  const preset = buildPreset(name, params);
  const blob = new Blob([JSON.stringify(preset, null, 2)], {
    type: "application/json",
  });
  triggerDownload(blob, filename);
}

export function parsePreset(json: string): Preset {
  const parsed = JSON.parse(json);
  if (!parsed || typeof parsed !== "object" || !parsed.params) {
    throw new Error("Invalid preset file");
  }
  const params: GeneratorParams = {
    ...DEFAULT_PARAMS,
    ...parsed.params,
    mapping: { ...DEFAULT_MAPPING, ...(parsed.params.mapping ?? {}) },
  };
  return { ...parsed, params } as Preset;
}
