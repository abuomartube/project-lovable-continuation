import { ShieldCheck, Languages, Smile, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const RULES = [
  { Icon: Languages, label: "English only", tint: "text-primary-glow", bg: "bg-primary/15", desc: "Practice in English to grow faster." },
  { Icon: Smile, label: "Be respectful", tint: "text-emerald-300", bg: "bg-emerald-400/15", desc: "Kind words, no hate or insults." },
  { Icon: Clock, label: "Stay on topic", tint: "text-amber-300", bg: "bg-amber-400/15", desc: "Follow the room's daily theme." },
];

export const RoomRulesBanner = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-glass-border/30 bg-card/30 px-3 py-2 animate-fade-in">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-primary text-white shadow-glow">
          <ShieldCheck className="h-3.5 w-3.5" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Room Rules
        </span>
        <div className="ml-1 flex flex-1 items-center gap-1.5 overflow-x-auto">
          {RULES.map(({ Icon, label, tint, bg }) => (
            <span
              key={label}
              className={cn(
                "press inline-flex shrink-0 items-center gap-1 rounded-full border border-glass-border/40 bg-secondary/40 px-2 py-0.5 text-[10px] font-medium text-foreground/90"
              )}
            >
              <span className={cn("flex h-4 w-4 items-center justify-center rounded-full", bg, tint)}>
                <Icon className="h-2.5 w-2.5" />
              </span>
              {label}
            </span>
          ))}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="press flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground hover:bg-white/5"
          title={open ? "Hide details" : "Show details"}
        >
          {open ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
        </button>
      </div>

      {open && (
        <ul className="mt-2 grid gap-1 animate-fade-in">
          {RULES.map(({ Icon, label, tint, bg, desc }) => (
            <li key={label} className="flex items-center gap-2 rounded-xl border border-glass-border/30 bg-secondary/30 px-2 py-1.5">
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-full", bg, tint)}>
                <Icon className="h-3 w-3" />
              </span>
              <div className="flex-1 text-[11px]">
                <span className="font-semibold">{label}</span>
                <span className="text-muted-foreground"> — {desc}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RoomRulesBanner;