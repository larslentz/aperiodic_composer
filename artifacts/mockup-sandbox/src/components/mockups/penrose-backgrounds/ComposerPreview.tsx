import React, { useMemo, useState } from "react";
import {
  BookOpen,
  Download,
  ExternalLink,
  HardDriveDownload,
  Loader2,
  Play,
  Save,
  Square,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import ControlPanel from "./ControlPanel";
import PenroseCanvas from "./PenroseCanvas";
import { generateEventSequence } from "./_shared/lib/musicMapping";
import { generatePenroseTiling } from "./_shared/lib/penrose";
import {
  DEFAULT_PARAMS,
  DEFAULT_VOICE_MIX,
  GeneratorParams,
  PenroseTiling,
  VOICE_LABELS,
} from "./_shared/lib/types";

export interface ComposerPreviewProps {
  /** Optional artwork layer rendered beneath the existing Penrose tiles. */
  backgroundLayer?: React.ReactNode;
  /** Clears the canvas background so the optional background layer shows through. */
  transparentCanvas?: boolean;
}

export default function ComposerPreview({
  backgroundLayer,
  transparentCanvas = false,
}: ComposerPreviewProps) {
  const [params, setParams] = useState<GeneratorParams>(DEFAULT_PARAMS);
  const [tiling, setTiling] = useState<PenroseTiling>(() => generatePenroseTiling(DEFAULT_PARAMS.depth));
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTileIds, setActiveTileIds] = useState<string[]>([]);
  const [voiceMix, setVoiceMix] = useState(DEFAULT_VOICE_MIX);
  const events = useMemo(() => generateEventSequence(tiling, params), [tiling, params]);
  const duration = events.length > 0
    ? Math.max(...events.map((event) => event.time + event.duration)).toFixed(1)
    : "0.0";

  const generate = () => {
    setIsGenerating(true);
    window.setTimeout(() => {
      const nextTiling = generatePenroseTiling(params.depth);
      setTiling(nextTiling);
      setIsPlaying(false);
      setActiveTileIds([]);
      setIsGenerating(false);
    }, 50);
  };

  const stopPlayback = () => {
    setIsPlaying(false);
    setActiveTileIds([]);
  };

  const startPlayback = () => {
    if (events.length === 0) return;
    setIsPlaying(true);
    setActiveTileIds(events.slice(0, 12).map((event) => event.tileId));
  };

  const setVoiceVolume = (voice: number, volume: number) => {
    setVoiceMix((previous) => previous.map((mix, index) => index === voice ? { ...mix, volume } : mix));
  };
  const toggleVoiceMute = (voice: number) => {
    setVoiceMix((previous) => previous.map((mix, index) => index === voice ? { ...mix, muted: !mix.muted } : mix));
  };

  return (
    <div className="dark min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      <header className="flex-none h-16 border-b border-border px-6 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-glow">
            A
          </div>
          <h1 className="text-xl font-bold tracking-tight">Aperiodic Composer</h1>
          <div className="hidden lg:flex flex-col gap-1 rounded-md border border-border/60 bg-background/40 px-3 py-1.5 leading-none">
            <span className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              By Lars Lentz
            </span>
            <a
              href="https://sleek.bio/larslentz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-sm font-semibold text-primary underline decoration-primary/70 underline-offset-2 transition-colors hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              More by Lars
              <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <BookOpen className="w-4 h-4 mr-2" />
            About
          </Button>
          <a href="#" onClick={(event) => event.preventDefault()} download data-testid="link-download-offline">
            <Button variant="outline" size="sm">
              <HardDriveDownload className="w-4 h-4 mr-2" />
              Download Offline
            </Button>
          </a>
          <label className="cursor-pointer">
            <Button variant="outline" size="sm" asChild>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Import Preset
              </span>
            </Button>
            <input type="file" accept=".json" className="hidden" data-testid="input-import-preset" />
          </label>
          <Button variant="outline" size="sm" data-testid="button-export-preset">
            <Save className="w-4 h-4 mr-2" />
            Save Preset
          </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-96 flex-none border-r border-border bg-sidebar overflow-y-auto custom-scrollbar">
          <ControlPanel
            params={params}
            onChange={setParams}
            onGenerate={generate}
            isGenerating={isGenerating}
          />
        </aside>

        <section className="flex-1 flex flex-col relative bg-background">
          <div className="flex-1 p-6 relative">
            {backgroundLayer && (
              <div className="absolute inset-6 z-0 overflow-hidden rounded-md" aria-hidden="true">
                {backgroundLayer}
              </div>
            )}
            <PenroseCanvas tiling={tiling} activeTileIds={activeTileIds} transparent={transparentCanvas} />
            {isGenerating && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <span className="text-muted-foreground animate-pulse">Computing geometry...</span>
              </div>
            )}
          </div>

          {params.melodyMode === "melodicInterweave" && (
            <div className="flex-none border-t border-border bg-card px-6 py-3 flex items-center gap-8">
              {voiceMix.map((mix, i) => (
                <div key={i} className="flex items-center gap-3 flex-1 max-w-xs">
                  <Button variant="ghost" size="icon" className="flex-none h-8 w-8" onClick={() => toggleVoiceMute(i)}>
                    {mix.muted ? <VolumeX className="w-4 h-4 text-muted-foreground" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">{VOICE_LABELS[i] ?? `Voice ${i}`}</div>
                    <Slider
                      value={[mix.volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      disabled={mix.muted}
                      onValueChange={(value) => setVoiceVolume(i, value[0])}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="h-20 border-t border-border bg-card px-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="default"
                size="lg"
                className="w-32"
                onClick={isPlaying ? stopPlayback : startPlayback}
                disabled={isGenerating || events.length === 0}
                data-testid="button-transport"
              >
                {isPlaying ? (
                  <><Square className="w-5 h-5 mr-2 fill-current" />Stop</>
                ) : (
                  <><Play className="w-5 h-5 mr-2 fill-current" />Play</>
                )}
              </Button>
              <div className="text-xs text-muted-foreground">
                <div>Events: {events.length}</div>
                <div>Duration: {duration}s</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="secondary" disabled={events.length === 0} data-testid="button-export-csv">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="default" disabled={events.length === 0} data-testid="button-export-midi">
                <Download className="w-4 h-4 mr-2" />
                Export MIDI
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
