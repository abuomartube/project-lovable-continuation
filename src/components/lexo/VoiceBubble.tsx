import { Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceBubbleProps {
  duration: string;
  time: string;
  side?: "left" | "right";
}

export const VoiceBubble = ({ duration, time, side = "right" }: VoiceBubbleProps) => {
  const isMe = side === "right";
  return (
    <div className={cn("flex w-full", isMe ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "flex max-w-[75%] items-center gap-3 rounded-2xl px-3 py-2.5 shadow-card",
          isMe
            ? "rounded-br-md bg-gradient-primary text-primary-foreground"
            : "rounded-tl-md border border-glass-border/40 bg-secondary/70",
        )}
      >
        <button className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 backdrop-blur">
          <Play className="h-4 w-4 fill-current" />
        </button>
        <div className="flex flex-1 items-center gap-0.5">
          {Array.from({ length: 22 }).map((_, i) => (
            <span
              key={i}
              className="w-0.5 rounded-full bg-current opacity-70"
              style={{ height: `${6 + Math.abs(Math.sin(i * 1.3)) * 16}px` }}
            />
          ))}
        </div>
        <span className="shrink-0 text-xs opacity-90">{duration}</span>
        <span className="shrink-0 text-[10px] opacity-70">{time}</span>
      </div>
    </div>
  );
};

export default VoiceBubble;