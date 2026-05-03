import { Smile, Paperclip, Send, Mic } from "lucide-react";
import { IconButton } from "./IconButton";

export const BottomActionBar = () => {
  const chips = [
    { label: "Topic", dot: "bg-primary" },
    { label: "Ice Breaker", dot: "bg-cyan-400" },
    { label: "Rotate", dot: "bg-emerald-400" },
    { label: "Image Talk", dot: "bg-pink-400" },
  ];
  return (
    <div className="border-t border-glass-border/40 bg-card/60 px-3 py-3 backdrop-blur-xl">
      <div className="mb-2.5 flex items-center gap-2 overflow-x-auto pb-1">
        {chips.map((c) => (
          <button
            key={c.label}
            className="flex shrink-0 items-center gap-1.5 rounded-full border border-glass-border/40 bg-secondary/40 px-3 py-1 text-xs text-muted-foreground hover:bg-secondary/70"
          >
            <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
            {c.label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <IconButton variant="ghost" size="md">
          <Smile className="h-5 w-5" />
        </IconButton>
        <div className="flex h-11 flex-1 items-center gap-2 rounded-full border border-glass-border/40 bg-secondary/50 px-4">
          <input
            placeholder="Type a message..."
            className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground focus:outline-none"
          />
          <Paperclip className="h-4 w-4 text-muted-foreground" />
        </div>
        <IconButton variant="primary" size="md">
          <Send className="h-4 w-4" />
        </IconButton>
      </div>
      <div className="mt-3 flex items-center justify-center gap-3">
        <button className="animate-mic-pulse flex h-14 w-14 items-center justify-center rounded-full bg-gradient-mic shadow-mic">
          <Mic className="h-6 w-6 text-white" />
        </button>
        <div className="flex flex-1 items-center gap-0.5">
          {Array.from({ length: 40 }).map((_, i) => (
            <span
              key={i}
              className="w-0.5 rounded-full bg-primary/60"
              style={{ height: `${4 + Math.abs(Math.sin(i * 0.6)) * 18}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BottomActionBar;