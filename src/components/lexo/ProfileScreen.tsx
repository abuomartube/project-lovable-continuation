import { ChevronLeft, Edit3, MessageCircle, Mic, DoorOpen, Lock, Flame } from "lucide-react";
import { IconButton } from "./IconButton";
import { Avatar } from "./Avatar";
import { useGamification } from "@/hooks/useGamification";
import { useStreak } from "@/hooks/useStreak";
import { tierForLevel } from "@/lib/gamification";

const fmtTime = (s: number) => {
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return m < 60 ? `${m} min` : `${Math.floor(m / 60)}h ${m % 60}m`;
};

export const ProfileScreen = () => {
  const { stats, level, badges } = useGamification();
  const streak = useStreak();
  const tier = tierForLevel(level.level);
  const liveStats = [
    { label: "Messages",    value: String(stats.messages),         Icon: MessageCircle, tint: "text-cyan-400 bg-cyan-400/15" },
    { label: "Voice Time",  value: fmtTime(stats.speakSeconds),    Icon: Mic,           tint: "text-pink-400 bg-pink-400/15" },
    { label: "Rooms Joined", value: String(stats.roomsJoined),     Icon: DoorOpen,      tint: "text-emerald-400 bg-emerald-400/15" },
  ];
  const unlockedCount = badges.filter((b) => b.unlocked).length;
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm"><ChevronLeft className="h-5 w-5" /></IconButton>
        <h2 className="text-sm font-semibold">Profile</h2>
        <IconButton variant="ghost" size="sm"><Edit3 className="h-4 w-4" /></IconButton>
      </div>
      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        <div className="flex flex-col items-center text-center">
          <Avatar name="Omar" size="lg" online />
          <h3 className="mt-3 text-base font-bold">Omar</h3>
          <span className="mt-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] font-medium text-primary-glow">
            {tier} · Lv {level.level}
          </span>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="flex items-center gap-2 font-semibold">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-gradient-primary text-[10px] font-bold text-white shadow-glow">
                {level.level}
              </span>
              Level {level.level}
            </span>
            <span className="text-muted-foreground">{level.intoLevel} / {level.needed} XP</span>
          </div>
          <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary/60">
            <div
              className="h-full rounded-full bg-gradient-primary shadow-glow transition-[width] duration-500"
              style={{ width: `${Math.max(2, level.progress * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[10px] text-muted-foreground">Total: {stats.totalXp} XP</p>
        </div>
        <div className="glass relative overflow-hidden rounded-2xl p-4">
          <div
            className={
              "pointer-events-none absolute inset-0 opacity-60 " +
              (streak.activeToday
                ? "bg-gradient-to-br from-orange-500/15 via-transparent to-amber-400/10"
                : "bg-gradient-to-br from-muted/20 via-transparent to-transparent")
            }
          />
          <div className="relative flex items-center gap-3">
            <span
              className={
                "flex h-11 w-11 items-center justify-center rounded-2xl shadow-glow " +
                (streak.activeToday
                  ? "bg-gradient-to-br from-orange-500 to-amber-400 text-white animate-soft-pulse"
                  : "bg-secondary/60 text-muted-foreground")
              }
            >
              <Flame className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold tabular-nums">{streak.current}</span>
                <span className="text-xs text-muted-foreground">day{streak.current === 1 ? "" : "s"} streak</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                {streak.activeToday
                  ? "You showed up today — keep it alive tomorrow!"
                  : streak.atRisk
                  ? "At risk! Practice today to keep your streak."
                  : "Practice today to start a new streak."}
              </p>
            </div>
            <div className="text-right">
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Best</div>
              <div className="text-sm font-semibold tabular-nums">{streak.longest}</div>
            </div>
          </div>
          <div className="relative mt-3 flex items-center justify-between gap-1">
            {Array.from({ length: 7 }).map((_, i) => {
              const dayIndex = 6 - i; // 0 = today
              const filled = streak.activeToday
                ? dayIndex < streak.current
                : dayIndex > 0 && dayIndex <= streak.current;
              return (
                <div
                  key={i}
                  className={
                    "h-1.5 flex-1 rounded-full " +
                    (filled ? "bg-gradient-to-r from-orange-500 to-amber-400" : "bg-secondary/60")
                  }
                />
              );
            })}
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {liveStats.map((s) => (
            <div key={s.label} className="glass flex flex-col items-center gap-1 rounded-2xl p-2.5">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full ${s.tint}`}><s.Icon className="h-3.5 w-3.5" /></span>
              <span className="text-sm font-bold">{s.value}</span>
              <span className="text-[9px] text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-xs font-bold">Badges</h4>
            <span className="text-[10px] text-muted-foreground">{unlockedCount} / {badges.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {badges.map(({ badge, unlocked }) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  title={`${badge.name} — ${badge.description}`}
                  className={
                    "relative flex flex-col items-center gap-1.5 rounded-2xl border p-2.5 text-center transition-all " +
                    (unlocked
                      ? "border-primary/30 bg-primary/5 shadow-[0_0_18px_hsl(var(--primary)/0.18)]"
                      : "border-glass-border/30 bg-secondary/20 opacity-50")
                  }
                >
                  <span
                    className={
                      "flex h-9 w-9 items-center justify-center rounded-xl text-white " +
                      (unlocked ? `bg-gradient-to-br shadow-glow ${badge.tint}` : "bg-secondary/60")
                    }
                  >
                    {unlocked ? <Icon className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5 text-muted-foreground" />}
                  </span>
                  <span className="text-[10px] font-semibold leading-tight">{badge.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
