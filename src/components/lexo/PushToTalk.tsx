import { Mic, MicOff } from "lucide-react";
import { useEffect } from "react";
import { LiveWaveform } from "./LiveWaveform";

interface PushToTalkProps {
  level: number;
  active: boolean;
  onStart: () => void;
  onStop: () => void;
  error?: string | null;
}

/** Hold-to-talk: pointer + Space key. */
export const PushToTalk = ({ level, active, onStart, onStop, error }: PushToTalkProps) => {
  // Spacebar push-to-talk
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === "Space" && !e.repeat && !(e.target as HTMLElement)?.closest("input,textarea")) {
        e.preventDefault();
        onStart();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        onStop();
      }
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, [onStart, onStop]);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <LiveWaveform level={level} active={active} />
        <button
          aria-label="Push to talk"
          onPointerDown={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLButtonElement).setPointerCapture(e.pointerId);
            onStart();
          }}
          onPointerUp={onStop}
          onPointerCancel={onStop}
          onPointerLeave={() => active && onStop()}
          className={
            "relative flex h-20 w-20 select-none items-center justify-center rounded-full text-white transition-transform " +
            (active
              ? "scale-110 bg-gradient-mic shadow-mic ring-4 ring-primary/50"
              : "bg-gradient-mic shadow-[0_0_40px_hsl(250_80%_60%/0.55)] ring-4 ring-primary/30 animate-mic-pulse active:scale-95")
          }
        >
          {/* Soft outer glow halo */}
          {!active && (
            <span className="pointer-events-none absolute -inset-2 rounded-full bg-primary/25 blur-xl animate-soft-pulse" />
          )}
          {active ? <Mic className="h-9 w-9" /> : <MicOff className="h-9 w-9 opacity-90" />}
          {active && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 ${20 + level * 60}px rgba(124,58,237,${0.5 + level * 0.5})` }}
            />
          )}
        </button>
        <LiveWaveform level={level} active={active} />
      </div>
      <span className={
        "text-[12px] font-bold uppercase tracking-wider " +
        (error ? "text-amber-300" : active ? "text-primary-glow" : "text-foreground/90")
      }>
        {error ? `⚠ ${error}` : active ? "Speaking… release to stop" : "🎙️ Tap to speak"}
      </span>
      {!active && !error && (
        <span className="text-[10px] text-muted-foreground">Hold the mic, or press Space</span>
      )}
    </div>
  );
};

export default PushToTalk;