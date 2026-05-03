import { Pause, Play } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface VoiceBubbleProps {
  /** "0:18" or seconds. */
  duration: string | number;
  time: string;
  side?: "left" | "right";
  /** Optional real audio URL. If omitted, playback is simulated. */
  src?: string;
  /** Optional precomputed peaks (0..1). If omitted, a deterministic shape is generated. */
  peaks?: number[];
  /** Used to derive the deterministic waveform. */
  seed?: number;
  bars?: number;
}

const parseDuration = (d: string | number): number => {
  if (typeof d === "number") return d;
  const [m, s] = d.split(":").map(Number);
  return (m || 0) * 60 + (s || 0);
};

const fmt = (s: number) => {
  const m = Math.floor(s / 60);
  const r = Math.max(0, Math.floor(s % 60));
  return `${m}:${r.toString().padStart(2, "0")}`;
};

const generatePeaks = (n: number, seed: number): number[] => {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = Math.abs(Math.sin((i + 1) * 0.7 + seed) + Math.sin((i + 1) * 1.9 + seed * 0.3) * 0.6);
    out.push(Math.min(1, 0.25 + v * 0.55));
  }
  return out;
};

export const VoiceBubble = ({
  duration,
  time,
  side = "right",
  src,
  peaks,
  seed = 1,
  bars = 28,
}: VoiceBubbleProps) => {
  const isMe = side === "right";
  const total = useMemo(() => parseDuration(duration), [duration]);
  const peakArr = useMemo(() => peaks ?? generatePeaks(bars, seed), [peaks, bars, seed]);

  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0); // seconds
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const offsetRef = useRef(0);

  const stopRaf = () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); rafRef.current = null; };

  const tick = () => {
    if (audioRef.current) {
      setPos(audioRef.current.currentTime);
    } else if (startedAtRef.current != null) {
      const elapsed = (performance.now() - startedAtRef.current) / 1000 + offsetRef.current;
      if (elapsed >= total) {
        setPos(total);
        setPlaying(false);
        startedAtRef.current = null;
        offsetRef.current = 0;
        stopRaf();
        return;
      }
      setPos(elapsed);
    }
    rafRef.current = requestAnimationFrame(tick);
  };

  const toggle = () => {
    if (playing) {
      // pause
      if (audioRef.current) audioRef.current.pause();
      else if (startedAtRef.current != null) {
        offsetRef.current += (performance.now() - startedAtRef.current) / 1000;
        startedAtRef.current = null;
      }
      stopRaf();
      setPlaying(false);
    } else {
      if (pos >= total) { setPos(0); offsetRef.current = 0; }
      if (audioRef.current) audioRef.current.play().catch(() => {});
      else startedAtRef.current = performance.now();
      setPlaying(true);
      rafRef.current = requestAnimationFrame(tick);
    }
  };

  useEffect(() => () => stopRaf(), []);

  // Real audio bindings
  useEffect(() => {
    if (!src) return;
    const a = new Audio(src);
    audioRef.current = a;
    const onEnd = () => { setPlaying(false); setPos(total); stopRaf(); };
    a.addEventListener("ended", onEnd);
    return () => { a.pause(); a.removeEventListener("ended", onEnd); audioRef.current = null; };
  }, [src, total]);

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = ratio * total;
    setPos(t);
    offsetRef.current = t;
    startedAtRef.current = playing ? performance.now() : null;
    if (audioRef.current) audioRef.current.currentTime = t;
  };

  const progress = total > 0 ? pos / total : 0;
  const remaining = Math.max(0, total - pos);

  return (
    <div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[75%] items-center gap-3 rounded-2xl px-3 py-2.5 shadow-card",
          isMe
            ? "rounded-br-md bg-gradient-primary text-primary-foreground shadow-glow"
            : "rounded-tl-md border border-glass-border/40 bg-secondary/70",
        )}
      >
        <button
          onClick={toggle}
          aria-label={playing ? "Pause voice message" : "Play voice message"}
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full backdrop-blur transition-all active:scale-95",
            isMe ? "bg-white/20 hover:bg-white/30" : "bg-primary/20 text-primary-glow hover:bg-primary/30",
            playing && "animate-soft-pulse",
          )}
        >
          {playing ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
        </button>

        <div
          onClick={seek}
          className="relative flex h-8 flex-1 cursor-pointer items-center gap-0.5"
        >
          {peakArr.map((p, i) => {
            const barProgress = (i + 1) / peakArr.length;
            const reached = barProgress <= progress;
            return (
              <span
                key={i}
                className={cn(
                  "w-0.5 rounded-full transition-[opacity,background-color] duration-100",
                  reached ? "opacity-100" : "opacity-40",
                )}
                style={{
                  height: `${4 + p * 22}px`,
                  background: "currentColor",
                }}
              />
            );
          })}
          {/* Playhead */}
          <span
            className="pointer-events-none absolute top-1/2 h-4 w-[2px] -translate-y-1/2 rounded-full bg-current shadow-[0_0_6px_currentColor] transition-[left] duration-100"
            style={{ left: `${progress * 100}%`, opacity: playing || pos > 0 ? 1 : 0 }}
          />
        </div>

        <span className="shrink-0 tabular-nums text-xs opacity-90">
          {playing || pos > 0 ? fmt(pos) : fmt(total)}
        </span>
        <span className="shrink-0 text-[10px] opacity-70">{time}</span>
      </div>
    </div>
  );
};

export default VoiceBubble;