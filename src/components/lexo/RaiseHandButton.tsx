import { Hand } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface RaiseHandButtonProps {
  /** Compact pill (control bars) vs full button (voice room footer). */
  variant?: "pill" | "full";
  className?: string;
  /** Auto-lower after N seconds (default 30). 0 disables. */
  autoLowerAfter?: number;
  onChange?: (raised: boolean) => void;
  /** Mock count of other raised hands shown as a badge. */
  raisedCount?: number;
  label?: string;
}

/**
 * Stateful "raise hand" control. Toggleable, with auto-lower timer,
 * a glow + wave animation while raised, and an optional count badge.
 * Works inside any voice surface; emits onChange so parent can broadcast
 * via the future WebRTC signaling channel.
 */
export const RaiseHandButton = ({
  variant = "full",
  className,
  autoLowerAfter = 30,
  onChange,
  raisedCount = 0,
  label = "Raise Hand",
}: RaiseHandButtonProps) => {
  const [raised, setRaised] = useState(false);
  const [remaining, setRemaining] = useState(autoLowerAfter);
  const timerRef = useRef<number | null>(null);

  const stop = () => { if (timerRef.current) window.clearInterval(timerRef.current); timerRef.current = null; };

  useEffect(() => () => stop(), []);

  const toggle = () => {
    const next = !raised;
    setRaised(next);
    onChange?.(next);
    stop();
    if (next && autoLowerAfter > 0) {
      setRemaining(autoLowerAfter);
      timerRef.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { setRaised(false); onChange?.(false); stop(); return 0; }
          return r - 1;
        });
      }, 1000);
    }
  };

  const totalRaised = raisedCount + (raised ? 1 : 0);

  if (variant === "pill") {
    return (
      <button
        onClick={toggle}
        title={raised ? `Hand raised — auto-lower in ${remaining}s` : "Raise your hand"}
        className={cn(
          "relative flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] transition-all active:scale-[0.96]",
          raised
            ? "border-amber-400/50 bg-amber-400/15 text-amber-200 shadow-[0_0_18px_hsl(40_90%_55%/0.45)]"
            : "border-glass-border/40 bg-secondary/60 text-foreground hover:bg-secondary",
          className,
        )}
      >
        <Hand className={cn("h-3 w-3", raised && "animate-soft-pulse")} />
        <span className="font-medium">{raised ? `Raised · ${remaining}s` : label}</span>
        {totalRaised > 0 && (
          <span className="rounded-full bg-amber-400/30 px-1.5 py-0.5 text-[9px] font-bold text-amber-100">
            {totalRaised}
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={raised}
      className={cn(
        "group relative flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-2xl border px-3 py-2 text-xs font-semibold transition-all active:scale-[0.97]",
        raised
          ? "border-amber-400/60 bg-gradient-to-br from-amber-500/30 to-orange-500/30 text-amber-100 shadow-[0_0_24px_hsl(40_90%_55%/0.55)]"
          : "border-glass-border/40 bg-secondary/50 text-foreground hover:bg-secondary",
        className,
      )}
    >
      {raised && (
        <span className="pointer-events-none absolute inset-0 -z-10 animate-soft-pulse bg-amber-400/10" />
      )}
      <Hand className={cn("h-4 w-4 transition-transform", raised && "-rotate-12 animate-soft-pulse text-amber-300")} />
      <span>{raised ? `Hand raised · ${remaining}s` : label}</span>
      {totalRaised > 0 && (
        <span className="ml-1 rounded-full bg-amber-400/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-100">
          {totalRaised}
        </span>
      )}
    </button>
  );
};

export default RaiseHandButton;