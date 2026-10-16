import React, { useState, useEffect, useRef, useMemo } from "react";
import { 
  GeneratorParams, 
  DEFAULT_PARAMS, 
  PenroseTiling, 
  MusicEvent,
  VoiceMixSettings,
  DEFAULT_VOICE_MIX,
  VOICE_LABELS
} from "@/lib/types";
import { generatePenroseTiling } from "@/lib/penrose";
import { generateEventSequence } from "@/lib/musicMapping";
import { AudioEngine } from "@/lib/audioEngine";
import { downloadMidiFile } from "@/lib/midiExport";
import { downloadEventCsv } from "@/lib/csvExport";
import { downloadPreset, parsePreset } from "@/lib/presetExport";

import PenroseCanvas from "@/components/PenroseCanvas";
import ControlPanel from "@/components/ControlPanel";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Square, Download, Upload, Loader2, Save, Volume2, VolumeX, HardDriveDownload, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Home() {
  const { toast } = useToast();
  
  const [params, setParams] = useState<GeneratorParams>(DEFAULT_PARAMS);
  const [tiling, setTiling] = useState<PenroseTiling | null>(null);
  const [events, setEvents] = useState<MusicEvent[]>([]);
  const [voiceMix, setVoiceMix] = useState<VoiceMixSettings[]>(DEFAULT_VOICE_MIX);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTileIds, setActiveTileIds] = useState<string[]>([]);
  
  const engineRef = useRef<AudioEngine | null>(null);
  const playbackAnimationFrame = useRef<number | null>(null);
  const playbackStartTime = useRef<number | null>(null);

  // Initialize engine
  useEffect(() => {
    engineRef.current = new AudioEngine();
    engineRef.current.onFinished = () => {
      setIsPlaying(false);
      setActiveTileIds([]);
      if (playbackAnimationFrame.current) {
        cancelAnimationFrame(playbackAnimationFrame.current);
      }
    };
    
    return () => {
      engineRef.current?.stop();
      if (playbackAnimationFrame.current) {
        cancelAnimationFrame(playbackAnimationFrame.current);
      }
    };
  }, []);

  // Generate tiling and sequence
  const generate = async () => {
    setIsGenerating(true);
    
    // Use setTimeout to allow UI to update to loading state
    setTimeout(() => {
      try {
        const newTiling = generatePenroseTiling(params.depth);
        const newEvents = generateEventSequence(newTiling, params);
        
        setTiling(newTiling);
        setEvents(newEvents);
        
        // Stop playback if we regenerate
        if (isPlaying) {
          stopPlayback();
        }
      } catch (err) {
        console.error(err);
        toast({
          title: "Generation Failed",
          description: "An error occurred while generating the sequence.",
          variant: "destructive"
        });
      } finally {
        setIsGenerating(false);
      }
    }, 50);
  };

  // Initial generation
  useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const startPlayback = () => {
    if (!engineRef.current || events.length === 0) return;
    
    const activeVoiceMix = params.melodyMode === "melodicInterweave" ? voiceMix : undefined;
    engineRef.current.play(events, 0.7, activeVoiceMix);
    setIsPlaying(true);
    playbackStartTime.current = performance.now();
    
    const animate = (time: number) => {
      if (!playbackStartTime.current) return;
      
      const elapsedSeconds = (time - playbackStartTime.current) / 1000;
      
      // Find currently playing tiles
      const active = events
        .filter(e => elapsedSeconds >= e.time && elapsedSeconds < e.time + e.duration)
        .map(e => e.tileId);
        
      setActiveTileIds(active);
      
      if (engineRef.current?.playing) {
        playbackAnimationFrame.current = requestAnimationFrame(animate);
      }
    };
    
    playbackAnimationFrame.current = requestAnimationFrame(animate);
  };

  const stopPlayback = () => {
    engineRef.current?.stop();
    setIsPlaying(false);
    setActiveTileIds([]);
    if (playbackAnimationFrame.current) {
      cancelAnimationFrame(playbackAnimationFrame.current);
    }
  };

  const toggleVoiceMute = (voice: number) => {
    setVoiceMix((prev) =>
      prev.map((m, i) => (i === voice ? { ...m, muted: !m.muted } : m)),
    );
    if (isPlaying) stopPlayback();
  };

  const setVoiceVolume = (voice: number, volume: number) => {
    setVoiceMix((prev) =>
      prev.map((m, i) => (i === voice ? { ...m, volume } : m)),
    );
    if (isPlaying) stopPlayback();
  };

  const handleExportMidi = () => {
    if (events.length === 0) return;
    downloadMidiFile(events, params.tempo);
    toast({ title: "Exported MIDI", description: "Sequence saved to disk." });
  };

  const handleExportCsv = () => {
    if (events.length === 0) return;
    downloadEventCsv(events);
    toast({ title: "Exported CSV", description: "Event data saved to disk." });
  };

  const handleExportPreset = () => {
    downloadPreset("penrose-preset", params);
    toast({ title: "Exported Preset", description: "Configuration saved to disk." });
  };

  const handleImportPreset = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const json = evt.target?.result as string;
        const preset = parsePreset(json);
        setParams(preset.params);
        toast({ title: "Preset Loaded", description: "Configuration restored." });
      } catch (err) {
        toast({
          title: "Import Failed",
          description: "Could not parse the preset file.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary selection:text-primary-foreground">
      {/* Header */}
      <header className="flex-none h-16 border-b border-border px-6 flex items-center justify-between bg-card">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-glow">
            A
          </div>
          <h1 className="text-xl font-bold tracking-tight">Aperiodic Composer</h1>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/about" aria-label="Read the thinking behind this app">
              <BookOpen className="w-4 h-4 mr-2" />
              About
            </Link>
          </Button>
          <a
            href={`${import.meta.env.BASE_URL}lars-lentz-aperiodic-composer-offline.zip`}
            download
            data-testid="link-download-offline"
          >
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
            <input 
              type="file" 
              accept=".json" 
              className="hidden" 
              onChange={handleImportPreset}
              data-testid="input-import-preset"
            />
          </label>
          <Button variant="outline" size="sm" onClick={handleExportPreset} data-testid="button-export-preset">
            <Save className="w-4 h-4 mr-2" />
            Save Preset
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Controls */}
        <aside className="w-96 flex-none border-r border-border bg-sidebar overflow-y-auto custom-scrollbar">
          <ControlPanel 
            params={params} 
            onChange={setParams} 
            onGenerate={generate}
            isGenerating={isGenerating}
          />
        </aside>

        {/* Center - Visualization & Transport */}
        <section className="flex-1 flex flex-col relative bg-background">
          <div className="flex-1 p-6 relative">
            {isGenerating ? (
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <span className="text-muted-foreground animate-pulse">Computing geometry...</span>
              </div>
            ) : null}
            <PenroseCanvas tiling={tiling} activeTileIds={activeTileIds} />
          </div>

          {/* Voice Mixer */}
          {params.melodyMode === "melodicInterweave" && (
            <div className="flex-none border-t border-border bg-card px-6 py-3 flex items-center gap-8">
              {voiceMix.map((mix, i) => (
                <div key={i} className="flex items-center gap-3 flex-1 max-w-xs">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="flex-none h-8 w-8"
                    onClick={() => toggleVoiceMute(i)}
                    data-testid={`button-mute-voice-${i}`}
                  >
                    {mix.muted ? (
                      <VolumeX className="w-4 h-4 text-muted-foreground" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </Button>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-1">{VOICE_LABELS[i] ?? `Voice ${i}`}</div>
                    <Slider
                      value={[mix.volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      disabled={mix.muted}
                      onValueChange={(v) => setVoiceVolume(i, v[0])}
                      data-testid={`slider-volume-voice-${i}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {/* Transport & Export Footer */}
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
                  <>
                    <Square className="w-5 h-5 mr-2 fill-current" />
                    Stop
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2 fill-current" />
                    Play
                  </>
                )}
              </Button>
              <div className="text-xs text-muted-foreground">
                <div>Events: {events.length}</div>
                <div>Duration: {events.length > 0 ? Math.max(...events.map(e => e.time + e.duration)).toFixed(1) : "0.0"}s</div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="secondary" onClick={handleExportCsv} disabled={events.length === 0} data-testid="button-export-csv">
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button variant="default" onClick={handleExportMidi} disabled={events.length === 0} data-testid="button-export-midi">
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
