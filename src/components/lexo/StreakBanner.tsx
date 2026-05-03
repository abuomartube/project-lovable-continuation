import { Flame, AlertTriangle, X, Frown, Trophy } from "lucide-react";
import { useDailyChallenge } from "@/hooks/useDailyChallenge";

export const StreakBanner = () => {
  const { completed, streak, bestStreak, streakLost, lostStreak, acknowledgeLost } = useDailyChallenge();

  // Lost streak: highest priority
  if (streakLost) {
    return (
      <div className="border-b border-rose-400/30 bg-rose-500/10 px-3 py-2 animate-fade-in">
        <div className="flex items-center gap-2 text-[11px] text-rose-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rose-500/30 text-rose-200">
            <Frown className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1">
            <strong className="font-semibold">You lost your streak 😢</strong> — your {lostStreak}-day flame went out. Start a new one today!
          </span>
          <button
            onClick={acknowledgeLost}
            className="rounded-full p-1 text-rose-200 hover:bg-white/5"
            title="Dismiss"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  // Missed today (no completion yet, but streak alive)
  if (!completed && streak > 0) {
    return (
      <div className="border-b border-amber-400/30 bg-amber-400/10 px-3 py-2 animate-fade-in">
        <div className="flex items-center gap-2 text-[11px] text-amber-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/25 text-amber-200">
            <AlertTriangle className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1">
            <strong className="font-semibold">You haven't completed today's challenge.</strong>{" "}
            Don't break your <span className="inline-flex items-center gap-0.5 font-bold text-orange-300"><Flame className="h-2.5 w-2.5" /> {streak}-day streak!</span>
          </span>
        </div>
      </div>
    );
  }

  // Active streak encouragement
  if (streak > 0) {
    return (
      <div className="border-b border-orange-400/30 bg-gradient-to-r from-orange-500/15 to-rose-500/10 px-3 py-2 animate-fade-in">
        <div className="flex items-center gap-2 text-[11px] text-orange-100">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-[0_0_12px_hsl(20_90%_55%/0.5)]">
            <Flame className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1">
            You are on <strong className="font-bold text-orange-200">Day {streak} 🔥</strong>
            {bestStreak > streak && <span className="ml-1 text-orange-200/70">— best: {bestStreak}</span>}
          </span>
          {streak >= 7 && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[9px] font-bold text-amber-200">
              <Trophy className="h-2.5 w-2.5" /> Weekly hero
            </span>
          )}
        </div>
      </div>
    );
  }

  // First-time / no streak: prompt to start
  if (!completed) {
    return (
      <div className="border-b border-glass-border/30 bg-card/30 px-3 py-2 animate-fade-in">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary-glow">
            <Flame className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1">
            Start your <strong className="font-semibold text-foreground">daily streak</strong> by completing today's challenge below.
          </span>
        </div>
      </div>
    );
  }

  return null;
};

export default StreakBanner;