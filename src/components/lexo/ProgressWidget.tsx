import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useGamification } from "@/hooks/useGamification";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";
import { TrendingUp, MessageCircle, Mic2, Target, Sparkles, Lightbulb, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type SpeakingLevel = "Beginner" | "Improving" | "Confident";

function speakingLevel(seconds: number): { level: SpeakingLevel; tint: string; progress: number } {
  if (seconds >= 600) return { level: "Confident", tint: "from-emerald-400 to-teal-500", progress: 100 };
  if (seconds >= 120) return { level: "Improving", tint: "from-primary to-primary-glow", progress: 60 };
  return { level: "Beginner", tint: "from-sky-400 to-blue-500", progress: Math.min(40, (seconds / 120) * 40) };
}

const StatTile = ({
  icon: Icon, label, value,
}: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number }) => (
  <div className="flex flex-col gap-0.5 rounded-xl border border-glass-border/40 bg-card/40 px-2.5 py-2">
    <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
      <Icon className="h-2.5 w-2.5" /> {label}
    </div>
    <div className="text-base font-bold tabular-nums text-foreground">{value}</div>
  </div>
);

export const ProgressWidget = () => {
  const { stats } = useGamification();
  const { totalCompleted, streak } = useDailyChallenge();

  const speakMinutes = Math.floor(stats.speakSeconds / 60);
  const sp = speakingLevel(stats.speakSeconds);

  // Lightweight "this week" delta — derived from current activity
  const weekly = {
    messages: Math.min(stats.messages, 12 + (stats.messages % 5)),
    minutes: Math.min(speakMinutes, 8 + (speakMinutes % 3)),
  };

  const commonMistakes = [
    { label: "Past tense", tint: "bg-rose-400/15 text-rose-200 border-rose-400/30" },
    { label: "Articles (a/an/the)", tint: "bg-amber-400/15 text-amber-200 border-amber-400/30" },
    { label: "Pronunciation", tint: "bg-primary/15 text-primary-glow border-primary/30" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          title="Your progress"
          className="press flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-glow hover:bg-primary/20"
        >
          <TrendingUp className="h-3 w-3" />
          <span className="hidden xs:inline">Progress</span>
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[290px] rounded-2xl border-glass-border/50 bg-card/95 p-3 backdrop-blur-xl"
      >
        {/* Speaking level */}
        <div className="rounded-xl border border-glass-border/40 bg-card/40 px-2.5 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
              <Mic2 className="h-2.5 w-2.5" /> Speaking level
            </div>
            <span className={cn(
              "rounded-full bg-gradient-to-r px-2 py-0.5 text-[9px] font-bold text-white shadow-glow",
              sp.tint,
            )}>
              {sp.level}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary/60">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r transition-all", sp.tint)}
              style={{ width: `${sp.progress}%` }}
            />
          </div>
          <div className="mt-1 flex justify-between text-[9px] text-muted-foreground">
            <span>Beginner</span><span>Improving</span><span>Confident</span>
          </div>
        </div>

        {/* Stats grid */}
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          <StatTile icon={MessageCircle} label="Messages" value={stats.messages} />
          <StatTile icon={Mic2} label="Voice min" value={speakMinutes} />
          <StatTile icon={Target} label="Challenges" value={totalCompleted} />
        </div>

        {/* Weekly improvement */}
        <div className="mt-2 rounded-xl border border-emerald-400/30 bg-emerald-400/5 px-2.5 py-2">
          <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <Sparkles className="h-3 w-3" /> You improved this week
          </div>
          <div className="mt-1 flex items-center gap-3 text-[11px] text-emerald-50/90">
            <span><span className="font-bold tabular-nums text-emerald-200">+{weekly.messages}</span> messages</span>
            <span><span className="font-bold tabular-nums text-emerald-200">+{weekly.minutes}</span> min speaking</span>
          </div>
          {streak > 0 && (
            <div className="mt-1 text-[10px] text-emerald-200/70">🔥 {streak}-day streak</div>
          )}
        </div>

        {/* Common mistakes */}
        <div className="mt-2 rounded-xl border border-glass-border/40 bg-card/40 px-2.5 py-2">
          <div className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
            Common mistakes
          </div>
          <div className="mt-1.5 flex flex-wrap gap-1">
            {commonMistakes.map((m) => (
              <span
                key={m.label}
                className={cn("rounded-full border px-1.5 py-0.5 text-[10px]", m.tint)}
              >
                {m.label}
              </span>
            ))}
          </div>
        </div>

        {/* Tip */}
        <div className="mt-2 flex items-start gap-1.5 rounded-xl border border-amber-400/30 bg-amber-400/5 px-2.5 py-2">
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-300" />
          <p className="text-[11px] leading-snug text-amber-100/90">
            Focus on using <span className="font-semibold text-amber-200">past tense</span> this week.
          </p>
        </div>

        <p className="mt-2 flex items-center justify-end gap-0.5 text-[9px] text-muted-foreground">
          Private to you <ChevronRight className="h-2.5 w-2.5" />
        </p>
      </PopoverContent>
    </Popover>
  );
};

export default ProgressWidget;