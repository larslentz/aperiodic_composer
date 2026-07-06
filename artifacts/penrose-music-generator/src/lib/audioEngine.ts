import type { MusicEvent } from "./types";

const GROUP_WAVEFORMS: OscillatorType[] = ["sine", "triangle", "sawtooth", "square"];

function midiToFrequency(note: number): number {
  return 440 * Math.pow(2, (note - 69) / 12);
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: { osc: OscillatorNode; gain: GainNode }[] = [];
  private timers: number[] = [];
  private startedAt = 0;
  public onFinished: (() => void) | null = null;
  public playing = false;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext)();
    }
    return this.ctx;
  }

  play(events: MusicEvent[], masterVolume = 0.7) {
    this.stop();
    if (events.length === 0) return;
    const ctx = this.ensureContext();
    if (ctx.state === "suspended") void ctx.resume();

    this.playing = true;
    this.startedAt = ctx.currentTime;
    const totalDuration = Math.max(
      ...events.map((e) => e.time + e.duration),
    );

    for (const evt of events) {
      const when = this.startedAt + evt.time;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const panner = ctx.createStereoPanner();

      osc.type = GROUP_WAVEFORMS[evt.sampleGroup] ?? "sine";
      osc.frequency.value = midiToFrequency(evt.note);
      panner.pan.value = Math.max(-1, Math.min(1, evt.pan));

      const peak = Math.min(0.9, (evt.velocity / 127) * masterVolume);
      const attack = Math.min(0.03, evt.duration * 0.2);
      const release = Math.min(0.25, evt.duration * 0.6);

      gain.gain.setValueAtTime(0, when);
      gain.gain.linearRampToValueAtTime(peak, when + attack);
      gain.gain.setValueAtTime(peak, when + Math.max(attack, evt.duration - release));
      gain.gain.linearRampToValueAtTime(0.0001, when + evt.duration);

      osc.connect(gain);
      gain.connect(panner);
      panner.connect(ctx.destination);

      osc.start(when);
      osc.stop(when + evt.duration + 0.05);
      this.activeNodes.push({ osc, gain });
    }

    const finishTimer = window.setTimeout(() => {
      this.playing = false;
      this.onFinished?.();
    }, (totalDuration + 0.3) * 1000);
    this.timers.push(finishTimer);
  }

  stop() {
    for (const { osc } of this.activeNodes) {
      try {
        osc.stop();
      } catch {
        // already stopped
      }
    }
    this.activeNodes = [];
    for (const t of this.timers) window.clearTimeout(t);
    this.timers = [];
    this.playing = false;
  }
}
