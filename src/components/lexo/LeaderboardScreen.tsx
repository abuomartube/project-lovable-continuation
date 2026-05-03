import { ChevronLeft, ChevronDown, Trophy, Flame } from "lucide-react";
import { IconButton } from "./IconButton";
import { Avatar } from "./Avatar";
import { useGamification } from "@/hooks/useGamification";
import { useStreak } from "@/hooks/useStreak";
import { useOnboarding } from "@/hooks/useOnboarding";
import { tierForLevel } from "@/lib/gamification";

const seedRanks = [
  { name: "Omar",  xp: 850, streak: 12 },
  { name: "Sara",  xp: 720, streak: 9 },
  { name: "James", xp: 610, streak: 4 },
  { name: "Lina",  xp: 540, streak: 7 },
  { name: "Noah",  xp: 430, streak: 2 },
];
const medal = ["bg-amber-400 text-amber-950", "bg-slate-300 text-slate-900", "bg-orange-500 text-orange-50"];

export const LeaderboardScreen = () => {
  const { stats, level } = useGamification();
  const streak = useStreak();
  const { profile } = useOnboarding();
  const meName = profile?.name?.trim() || "You";
  const ranks = [...seedRanks, { name: meName, xp: stats.totalXp, streak: streak.current, me: true as const }]
    .sort((a, b) => b.xp - a.xp);
  return (
  <div className="flex h-full flex-col">
    <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
      <IconButton variant="ghost" size="sm"><ChevronLeft className="h-5 w-5" /></IconButton>
      <h2 className="flex items-center gap-1.5 text-sm font-semibold"><Trophy className="h-4 w-4 text-amber-400" /> Leaderboard</h2>
      <button className="flex items-center gap-1 rounded-full border border-glass-border/40 bg-secondary/50 px-2 py-1 text-[10px]">This Week <ChevronDown className="h-3 w-3" /></button>
    </div>
    <div className="flex-1 space-y-2 overflow-y-auto px-3 py-4">
      {ranks.map((r, i) => {
        const isMe = "me" in r && r.me;
        return (
          <div
            key={r.name + i}
            className={
              "glass glass-hover flex items-center gap-3 rounded-[20px] p-2.5 " +
              (isMe ? "!border-primary/60 shadow-glow" : "")
            }
          >
            <span className={"flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold " + (i < 3 ? medal[i] : "bg-secondary/70 text-muted-foreground")}>{i + 1}</span>
            <Avatar name={r.name} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {r.name} {isMe && <span className="text-[9px] text-primary-glow">(you)</span>}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {tierForLevel(isMe ? level.level : Math.max(1, Math.floor(r.xp / 140)))}
                {r.streak > 0 && (
                  <span className="ml-1.5 inline-flex items-center gap-0.5 text-orange-400">
                    <Flame className="h-2.5 w-2.5" />{r.streak}d
                  </span>
                )}
              </p>
            </div>
            <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary-glow tabular-nums">{r.xp} XP</span>
          </div>
        );
      })}
    </div>
    <div className="border-t border-glass-border/40 bg-card/60 px-3 py-3 backdrop-blur-xl">
      <button className="flex h-11 w-full items-center justify-center rounded-2xl border border-primary/40 bg-primary/5 text-xs font-medium hover:bg-primary/10">View full leaderboard</button>
    </div>
  </div>
  );
};

export default LeaderboardScreen;
