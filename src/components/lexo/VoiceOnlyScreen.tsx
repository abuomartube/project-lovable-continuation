import { ChevronLeft, Mic, Hand, MessageSquare, LogOut } from "lucide-react";
import { IconButton } from "./IconButton";
import { Avatar } from "./Avatar";

export const VoiceOnlyScreen = () => {
  const listeners = ["Sara", "Omar", "Lina", "James"];
  return (
    <div dir="rtl" className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm">
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </IconButton>
        <div className="flex flex-col items-center">
          <h2 className="text-sm font-semibold">غرفة الصوت فقط</h2>
          <span className="mt-0.5 flex items-center gap-1 text-[10px] text-success">
            <span className="h-1.5 w-1.5 rounded-full bg-success" /> 10 online
          </span>
        </div>
        <span className="h-8 w-8" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4">
        <div className="relative">
          <span className="absolute inset-0 -m-6 animate-ping rounded-full bg-primary/20" />
          <span className="absolute inset-0 -m-3 rounded-full bg-primary/15 blur-xl" />
          <button className="animate-mic-pulse relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-mic shadow-mic ring-4 ring-primary/30">
            <Mic className="h-12 w-12 text-white" />
          </button>
        </div>
        <p className="text-sm font-semibold text-foreground">You are Live</p>
        <p className="font-mono text-xs text-muted-foreground">00:45</p>

        <div className="mt-4 w-full">
          <p className="mb-2 text-center text-[10px] text-muted-foreground">Listeners</p>
          <div className="flex justify-center -space-x-2">
            {listeners.map((n) => (
              <Avatar key={n} name={n} size="sm" />
            ))}
            <span className="mr-2 rounded-full border border-glass-border/40 bg-secondary/60 px-2 py-1 text-[10px] text-muted-foreground">
              +6
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t border-glass-border/40 bg-card/60 px-3 py-3 backdrop-blur-xl">
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-glass-border/40 bg-secondary/50 px-3 py-2 text-xs text-foreground hover:bg-secondary">
          <Hand className="h-3.5 w-3.5" /> Raise Hand
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl border border-glass-border/40 bg-secondary/50 px-3 py-2 text-xs text-foreground hover:bg-secondary">
          <MessageSquare className="h-3.5 w-3.5" /> Message
        </button>
        <button className="flex flex-1 items-center justify-center gap-1.5 rounded-2xl bg-destructive/90 px-3 py-2 text-xs font-semibold text-destructive-foreground shadow-[0_0_20px_hsl(var(--destructive)/0.45)] hover:bg-destructive">
          <LogOut className="h-3.5 w-3.5" /> Leave
        </button>
      </div>
    </div>
  );
};

export default VoiceOnlyScreen;