import { Target, Clock, Sparkles, CheckCircle2, Flame, MessageSquarePlus, Zap, Award } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DAILY_CHALLENGES } from "@/lib/challenges";
import { useDailyChallenge, getDayIndex, msUntilNextDay } from "@/hooks/useDailyChallenge";
import { useGamification } from "@/hooks/useGamification";

function pickChallengeForDay(dayIndex: number) {
  return DAILY_CHALLENGES[dayIndex % DAILY_CHALLENGES.length];
}

function formatCountdown(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

interface Props {
  onStart: (challenge: string) => void;
  onQuickReply?: (starter: string) => void;
}

const QUICK_REPLIES = [
  "I went...",
  "I like...",
  "Yesterday I...",
  "I think that...",
  "My favorite...",
];

export const DailyChallengeBanner = ({ onStart, onQuickReply }: Props) => {
  const dayIndex = useMemo(() => getDayIndex(), []);
  const challenge = useMemo(() => pickChallengeForDay(dayIndex), [dayIndex]);
  const { completed, streak, bestStreak, complete } = useDailyChallenge();
  const { award } = useGamification();
  const [countdown, setCountdown] = useState(msUntilNextDay());

  // Tick countdown every second
  useEffect(() => {
    const i = setInterval(() => setCountdown(msUntilNextDay()), 1000);
    return () => clearInterval(i);
  }, []);

  const handleStart = () => {
    onStart(challenge);
    if (!completed) {
      complete();
      award({ type: "challenge-completed", streak: streak + 1 });
    }
  };

  return (
    <div className="border-b border-glass-border/40 bg-card/40 px-3 py-2.5 animate-fade-in">
      <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent px-3 py-2.5 shadow-[0_0_22px_hsl(250_80%_60%/0.2)]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/25 blur-2xl" />
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-white shadow-glow">
            <Target className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-primary-glow">
                Today's Challenge
              </span>
              {streak > 0 && (
                <span
                  className="inline-flex items-center gap-0.5 rounded-full bg-orange-400/15 px-1.5 py-0.5 text-[9px] font-bold text-orange-300"
                  title={`Best streak: ${bestStreak} days`}
                >
                  <Flame className="h-2.5 w-2.5" /> Day {streak}
                </span>
              )}
              <span
                className={
                  "ml-auto inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold tabular-nums " +
                  (countdown < 2 * 3600_000
                    ? "bg-rose-400/15 text-rose-200 ring-1 ring-rose-400/30 animate-soft-pulse"
                    : "bg-secondary/60 text-muted-foreground")
                }
                title="Time left to complete today's challenge"
              >
                <Clock className="h-2.5 w-2.5" /> Ends in {formatCountdown(countdown)}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[12px] font-semibold text-foreground">
              {challenge}
            </p>
            {completed && (
              <p className="mt-0.5 inline-flex items-center gap-2 text-[10px] font-semibold text-emerald-300">
                <span className="inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> You completed today's challenge</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-primary-glow"><Zap className="h-2.5 w-2.5" /> +{50 + Math.min(10, streak) * 5} XP</span>
                <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-400/15 px-1.5 py-0.5 text-amber-300"><Award className="h-2.5 w-2.5" /> Badge progress</span>
              </p>
            )}
          </div>
          <button
            onClick={handleStart}
            disabled={completed}
            className={
              "press shrink-0 inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-[11px] font-semibold shadow-glow disabled:cursor-default " +
              (completed
                ? "bg-emerald-500/20 text-emerald-200 ring-1 ring-emerald-400/40"
                : "bg-gradient-primary text-white")
            }
          >
            {completed ? <CheckCircle2 className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
            {completed ? "Done" : "Start Answer"}
          </button>
        </div>
      </div>

      {/* Quick replies */}
      <div className="mt-2 flex items-center gap-1.5 overflow-x-auto pb-0.5">
        <span className="inline-flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          <MessageSquarePlus className="h-3 w-3" /> Quick start
        </span>
        {QUICK_REPLIES.map((q) => (
          <button
            key={q}
            onClick={() => (onQuickReply ?? onStart)(q + " ")}
            className="press shrink-0 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-1 text-[11px] text-primary-glow hover:bg-primary/20"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DailyChallengeBanner;