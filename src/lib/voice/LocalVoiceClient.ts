import type { Speaker, VoiceClient, VoiceListener } from "./types";

/**
 * LocalVoiceClient — UI-only impl. No signaling, no peers.
 * Captures the local microphone, runs an AnalyserNode, and emits
 * smoothed RMS levels so the UI (waveform / speaking indicator) feels real.
 *
 * Swap for WebRTCVoiceClient later without touching components.
 */
export class LocalVoiceClient implements VoiceClient {
  private listeners = new Set<VoiceListener>();
  private stream: MediaStream | null = null;
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private raf = 0;
  private ptt = false;
  private muted = false;
  private autoDuck = false;
  private smoothed = 0;
  private speaking = false;
  private localId = "me";
  private localName = "You";

  // Mock remote speakers — would be driven by WebRTC peer events later.
  private remotes: Speaker[] = [
    { id: "sara", name: "Sara", level: 0, speaking: false, muted: false },
    { id: "omar", name: "Omar", level: 0, speaking: false, muted: false },
    { id: "lina", name: "Lina", level: 0, speaking: false, muted: false },
  ];
  private remoteTimer: number | null = null;

  on(listener: VoiceListener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private emit(...events: Parameters<VoiceListener>[0][]) {
    for (const e of events) for (const l of this.listeners) l(e);
  }

  async connect(_roomId: string, identity: { id: string; name: string }) {
    this.localId = identity.id;
    this.localName = identity.name;
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new Ctx();
      const src = this.ctx.createMediaStreamSource(this.stream);
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.6;
      src.connect(this.analyser);
      this.gateTracks();
      this.tick();
      this.startRemoteSimulation();
    } catch (err) {
      this.emit({ type: "error", message: err instanceof Error ? err.message : "Mic permission denied" });
    }
  }

  async disconnect() {
    cancelAnimationFrame(this.raf);
    if (this.remoteTimer) window.clearInterval(this.remoteTimer);
    this.stream?.getTracks().forEach((t) => t.stop());
    await this.ctx?.close();
    this.stream = null;
    this.ctx = null;
    this.analyser = null;
  }

  setPTT(active: boolean) {
    this.ptt = active;
    this.gateTracks();
    this.emit({ type: "ptt", active });
  }
  setMuted(muted: boolean) {
    this.muted = muted;
    this.gateTracks();
  }
  setAutoDuckOthers(enabled: boolean) {
    this.autoDuck = enabled;
  }

  /** PTT off OR muted ⇒ disable mic track (real silence on the wire). */
  private gateTracks() {
    const enabled = this.ptt && !this.muted;
    this.stream?.getAudioTracks().forEach((t) => (t.enabled = enabled));
  }

  private tick = () => {
    if (!this.analyser) return;
    const buf = new Uint8Array(this.analyser.fftSize);
    this.analyser.getByteTimeDomainData(buf);
    let sum = 0;
    for (let i = 0; i < buf.length; i++) {
      const v = (buf[i] - 128) / 128;
      sum += v * v;
    }
    const rms = Math.sqrt(sum / buf.length);
    const gated = this.ptt && !this.muted ? rms : 0;
    // smooth + amplify
    this.smoothed = this.smoothed * 0.7 + Math.min(1, gated * 4) * 0.3;
    const speakingNow = this.smoothed > 0.08;

    this.emit({ type: "local-level", level: this.smoothed });

    if (speakingNow !== this.speaking) {
      this.speaking = speakingNow;
      this.broadcastSpeakers();
    } else {
      // still emit periodic speaker level updates
      this.broadcastSpeakers();
    }
    this.raf = requestAnimationFrame(this.tick);
  };

  /** Simulated remote VAD until WebRTC is wired in. */
  private startRemoteSimulation() {
    this.remoteTimer = window.setInterval(() => {
      this.remotes = this.remotes.map((s) => {
        // Auto-duck: if local is speaking, force remotes silent.
        if (this.autoDuck && this.speaking) {
          return { ...s, level: 0, speaking: false };
        }
        const active = Math.random() > 0.75;
        const level = active ? 0.3 + Math.random() * 0.6 : Math.random() * 0.05;
        return { ...s, level, speaking: level > 0.2 };
      });
      this.broadcastSpeakers();
    }, 700);
  }

  private broadcastSpeakers() {
    const local: Speaker = {
      id: this.localId,
      name: this.localName,
      level: this.smoothed,
      speaking: this.speaking,
      muted: this.muted || !this.ptt,
      isLocal: true,
    };
    this.emit({ type: "speakers", speakers: [local, ...this.remotes] });
  }
}

let singleton: LocalVoiceClient | null = null;
export const getVoiceClient = (): LocalVoiceClient => (singleton ??= new LocalVoiceClient());