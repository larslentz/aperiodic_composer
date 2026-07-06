import React from "react";
import { 
  GeneratorParams, 
  TRAVERSAL_MODES, 
  SCALE_NAMES, 
  MAPPING_SOURCES,
  MELODY_MODES
} from "@/lib/types";
import { ROOT_NOTE_OPTIONS } from "@/lib/scales";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { RefreshCw } from "lucide-react";

interface ControlPanelProps {
  params: GeneratorParams;
  onChange: (params: GeneratorParams) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}

export default function ControlPanel({ params, onChange, onGenerate, isGenerating }: ControlPanelProps) {
  const updateParam = <K extends keyof GeneratorParams>(key: K, value: GeneratorParams[K]) => {
    onChange({ ...params, [key]: value });
  };

  const updateMapping = <K extends keyof GeneratorParams["mapping"]>(key: K, value: GeneratorParams["mapping"][K]) => {
    onChange({ ...params, mapping: { ...params.mapping, [key]: value } });
  };

  return (
    <div className="p-6 space-y-8 pb-20">
      
      {/* Geometry Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Geometry</h2>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <Label>Recursion Depth</Label>
            <span className="text-xs text-muted-foreground">{params.depth}</span>
          </div>
          <Slider 
            value={[params.depth]} 
            min={1} 
            max={6} 
            step={1}
            onValueChange={(v) => updateParam("depth", v[0])}
            data-testid="slider-depth"
          />
          <p className="text-[10px] text-muted-foreground">Higher depth exponentially increases tile count.</p>
        </div>

        <div className="space-y-2">
          <Label>Traversal Mode</Label>
          <Select value={params.traversalMode} onValueChange={(v: any) => updateParam("traversalMode", v)}>
            <SelectTrigger data-testid="select-traversal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRAVERSAL_MODES.map(mode => (
                <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <Separator />

      {/* Music Section */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Musical Parameters</h2>

        <div className="space-y-2">
          <Label>Melody Mode</Label>
          <Select value={params.melodyMode} onValueChange={(v: any) => updateParam("melodyMode", v)}>
            <SelectTrigger data-testid="select-melody-mode">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MELODY_MODES.map(mode => (
                <SelectItem key={mode.value} value={mode.value}>{mode.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground">
            Geometric maps tile data directly to notes. Melodic / Interweave splits kite and dart tiles into two smoothed, phrasing voices that interlock.
          </p>
        </div>

        {params.melodyMode === "melodicInterweave" && (
          <div className="space-y-4 rounded-md border border-border/50 p-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Melodic Contour</h3>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Phrase Length</Label>
                <span className="text-xs text-muted-foreground">{params.contourPhraseLen} notes</span>
              </div>
              <Slider
                value={[params.contourPhraseLen]}
                min={4}
                max={32}
                step={1}
                onValueChange={(v) => updateParam("contourPhraseLen", v[0])}
                data-testid="slider-contour-phrase-len"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Contour Amount</Label>
                <span className="text-xs text-muted-foreground">{params.contourAmplitude} degrees</span>
              </div>
              <Slider
                value={[params.contourAmplitude]}
                min={0}
                max={8}
                step={1}
                onValueChange={(v) => updateParam("contourAmplitude", v[0])}
                data-testid="slider-contour-amplitude"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label className="text-xs">Max Leap</Label>
                <span className="text-xs text-muted-foreground">{params.maxIntervalJump} degrees</span>
              </div>
              <Slider
                value={[params.maxIntervalJump]}
                min={1}
                max={6}
                step={1}
                onValueChange={(v) => updateParam("maxIntervalJump", v[0])}
                data-testid="slider-max-interval-jump"
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              Shorter phrases and a smaller max leap make voices move stepwise and follow each other closely; a larger contour amount adds wider melodic swings.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Tempo (BPM)</Label>
            <Select value={params.tempo.toString()} onValueChange={(v) => updateParam("tempo", parseInt(v, 10))}>
              <SelectTrigger data-testid="select-tempo">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[60, 72, 84, 96, 110, 120, 140].map(bpm => (
                  <SelectItem key={bpm} value={bpm.toString()}>{bpm} BPM</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Rhythm Density</Label>
            <div className="pt-2">
              <Slider 
                value={[Math.round(params.rhythmDensity * 100)]} 
                min={10} 
                max={100} 
                step={5}
                onValueChange={(v) => updateParam("rhythmDensity", v[0] / 100)}
                data-testid="slider-density"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Scale</Label>
            <Select value={params.scale} onValueChange={(v: any) => updateParam("scale", v)}>
              <SelectTrigger data-testid="select-scale">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {SCALE_NAMES.map(scale => (
                  <SelectItem key={scale.value} value={scale.value}>{scale.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Root Note</Label>
            <Select value={params.rootNote.toString()} onValueChange={(v) => updateParam("rootNote", parseInt(v, 10))}>
              <SelectTrigger data-testid="select-root">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ROOT_NOTE_OPTIONS.map(note => (
                  <SelectItem key={note.value} value={note.value.toString()}>{note.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Range Low (MIDI)</Label>
            <Select value={params.noteRangeLow.toString()} onValueChange={(v) => updateParam("noteRangeLow", parseInt(v, 10))}>
              <SelectTrigger data-testid="select-range-low">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) => i + 24).map(note => (
                  <SelectItem key={note} value={note.toString()}>{note}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Range High (MIDI)</Label>
            <Select value={params.noteRangeHigh.toString()} onValueChange={(v) => updateParam("noteRangeHigh", parseInt(v, 10))}>
              <SelectTrigger data-testid="select-range-high">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 60 }, (_, i) => i + 48).map(note => (
                  <SelectItem key={note} value={note.toString()}>{note}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <Separator />

      {/* Mapping Section */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-primary">Mapping Matrix</h2>
        <p className="text-xs text-muted-foreground mb-4">Assign geometric properties to musical parameters.</p>

        {[
          { label: "Pitch / Note", key: "noteSource" as const },
          { label: "Velocity / Accent", key: "velocitySource" as const },
          { label: "Note Duration", key: "durationSource" as const },
          { label: "Stereo Panning", key: "panSource" as const },
          { label: "Timbre / Group", key: "sampleGroupSource" as const },
        ].map(({ label, key }) => (
          <div key={key} className="flex items-center justify-between">
            <Label className="text-xs w-1/2">{label}</Label>
            <Select 
              value={params.mapping[key]} 
              onValueChange={(v: any) => updateMapping(key, v)}
            >
              <SelectTrigger className="w-1/2 h-8 text-xs" data-testid={`select-mapping-${key}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MAPPING_SOURCES.map(source => (
                  <SelectItem key={source.value} value={source.value} className="text-xs">
                    {source.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </section>

      <div className="pt-4 sticky bottom-0 bg-sidebar pb-4 border-t border-border/50">
        <Button 
          className="w-full" 
          onClick={onGenerate} 
          disabled={isGenerating}
          data-testid="button-generate"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4 mr-2" />
          )}
          {isGenerating ? "Computing..." : "Generate Sequence"}
        </Button>
      </div>

    </div>
  );
}
