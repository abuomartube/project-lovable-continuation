import { Users, Activity, Trophy, Heart } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Avatar } from "./Avatar";

const NAMES = ["Sara", "Omar", "Lina", "James", "Aya", "Yusuf", "Maya", "Karim", "Noor", "Leila"];
const TOP_ANSWERS = [
  { author: "Sara", text: "Last weekend I went hiking with friends and we discovered a tiny café hidden in the woods — it was magical.", likes: 24 },
  { author: "Omar", text: "I usually relax by reading, but this weekend I tried cooking a new recipe and surprisingly, it turned out delicious!", likes: 19 },
  { author: "Lina", text: "My weekend was calm — I painted in the morning and called my grandmother in the evening.", likes: 17 },
];

function pickDaily<T>(arr: T[]): T {
  const dayIndex = Math.floor(Date.now() / 86_400_000);
  return arr[dayIndex % arr.length];
}

export const SocialActivity = () => {
  // Completion count climbs slowly to feel "live"
  const [completedCount, setCompletedCount] = useState(() => 8 + Math.floor(Math.random() * 8));
  const [recent, setRecent] = useState<{ id: number; name: string }[]>([]);

  // Simulate new completions every 12-22s
  useEffect(() => {
    let id = 0;
    const tick = () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      setCompletedCount((c) => c + 1);
      setRecent((r) => [{ id: ++id, name }, ...r].slice(0, 3));
    };
    const initial = setTimeout(tick, 4000);
    const interval = setInterval(tick, 12000 + Math.random() * 10000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, []);

  const top = useMemo(() => pickDaily(TOP_ANSWERS), []);
  const latest = recent[0];

  return (
    <div className="space-y-2 border-b border-glass-border/40 bg-card/30 px-3 py-2.5 animate-fade-in">
      {/* Completion counter + live activity ticker */}
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-1 text-[10px] font-semibold text-emerald-200">
          <Users className="h-3 w-3" />
          <span key={completedCount} className="tabular-nums animate-fade-in">{completedCount}</span>
          students completed today
        </span>
        {latest && (
          <span
            key={latest.id}
            className="inline-flex animate-fade-in items-center gap-1.5 truncate rounded-full bg-secondary/40 px-2 py-1 text-[10px] text-muted-foreground"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <Activity className="h-2.5 w-2.5" />
            <span className="truncate">
              <span className="font-semibold text-foreground/90">{latest.name}</span> just completed the challenge
            </span>
          </span>
        )}
      </div>

      {/* Top answer of the day */}
      <div className="relative overflow-hidden rounded-2xl border border-amber-400/40 bg-gradient-to-br from-amber-500/15 via-orange-500/5 to-transparent px-3 py-2 shadow-[0_0_20px_hsl(35_95%_55%/0.18)]">
        <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-400/20 blur-2xl" />
        <div className="flex items-start gap-2">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 shadow-glow">
            <Trophy className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                Top answer of the day
              </span>
              <span className="ml-auto inline-flex items-center gap-0.5 rounded-full bg-rose-400/15 px-1.5 py-0.5 text-[9px] font-semibold text-rose-200">
                <Heart className="h-2.5 w-2.5 fill-rose-300 text-rose-300" /> {top.likes}
              </span>
            </div>
            <p className="mt-0.5 line-clamp-2 text-[12px] text-amber-50/95">"{top.text}"</p>
            <div className="mt-1 flex items-center gap-1.5">
              <Avatar name={top.author} size="xs" />
              <span className="text-[10px] font-semibold text-amber-200/90">{top.author}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialActivity;