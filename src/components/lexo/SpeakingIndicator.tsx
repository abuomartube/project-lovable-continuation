import { Mic } from "lucide-react";
import type { Speaker } from "@/lib/voice/types";
import { Avatar } from "./Avatar";

interface SpeakingIndicatorProps {
  speakers: Speaker[];
}

/** Compact "X is speaking" pill with live ring. */
export const SpeakingIndicator = ({ speakers }: SpeakingIndicatorProps) => {
  const active = speakers.filter((s) => s.speaking).slice(0, 3);
  if (active.length === 0) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-glass-border/40 bg-secondary/40 px-3 py-1.5 text-[10px] text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/60" />
        Quiet
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary-glow shadow-[0_0_18px_hsl(var(--primary)/0.35)]">
      <Mic className="h-3 w-3" />
      <div className="flex -space-x-1.5">
        {active.map((s) => (
          <span
            key={s.id}
            className="rounded-full ring-2 ring-primary/60 transition-shadow"
            style={{ boxShadow: `0 0 ${4 + s.level * 16}px hsl(var(--primary) / ${0.4 + s.level * 0.6})` }}
          >
            <Avatar name={s.name} size="xs" />
          </span>
        ))}
      </div>
      <span>
        {active.map((s) => s.name).join(", ")} {active.length > 1 ? "are" : "is"} speaking
      </span>
    </div>
  );
};

export default SpeakingIndicator;