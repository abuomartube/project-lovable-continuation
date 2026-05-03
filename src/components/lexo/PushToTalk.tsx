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
    <div className="flex flex-col items-center gap-1.5">
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
            "relative flex h-16 w-16 select-none items-center justify-center rounded-full text-white transition-transform " +
            (active
              ? "scale-110 bg-gradient-mic shadow-mic ring-4 ring-primary/40"
              : "bg-gradient-mic shadow-mic ring-4 ring-primary/20 animate-mic-pulse active:scale-95")
          }
        >
          {active ? <Mic className="h-7 w-7" /> : <MicOff className="h-7 w-7 opacity-90" />}
          {active && (
            <span
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 ${20 + level * 60}px rgba(124,58,237,${0.5 + level * 0.5})` }}
            />
          )}
        </button>
        <LiveWaveform level={level} active={active} />
      </div>
      <span className="text-[10px] font-medium text-muted-foreground">
        {error ? `⚠ ${error}` : active ? "Speaking… release to stop" : "Hold to speak (or press Space)"}
      </span>
    </div>
  );
};

export default PushToTalk;