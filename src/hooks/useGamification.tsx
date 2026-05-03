import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { BADGES, EMPTY_STATS, computeLevel, xpForEvent, type Badge, type Stats, type XPEvent } from "@/lib/gamification";

const STORAGE_KEY = "lexo:gamification:v1";

interface AwardEvent {
  id: number;
  delta: number;
  reason: string;
  badge?: Badge;
}

interface Ctx {
  stats: Stats;
  level: ReturnType<typeof computeLevel>;
  badges: { badge: Badge; unlocked: boolean }[];
  recent: AwardEvent[];
  award: (e: XPEvent) => void;
  reset: () => void;
}

const GamificationCtx = createContext<Ctx | null>(null);

const loadStats = (): Stats => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY_STATS, ...JSON.parse(raw) };
  } catch { /* noop */ }
  return EMPTY_STATS;
};

export const GamificationProvider = ({ children }: { children: ReactNode }) => {
  const [stats, setStats] = useState<Stats>(loadStats);
  const [recent, setRecent] = useState<AwardEvent[]>([]);
  const counter = useRef(0);
  const prevUnlocked = useRef<Set<string>>(new Set(BADGES.filter((b) => b.unlocked(stats)).map((b) => b.id)));

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stats)); } catch { /* noop */ }
  }, [stats]);

  const award = useCallback((e: XPEvent) => {
    const delta = xpForEvent(e);
    setStats((prev) => {
      const next: Stats = { ...prev, totalXp: prev.totalXp + delta };
      if (e.type === "message") next.messages = prev.messages + 1;
      else if (e.type === "speak") next.speakSeconds = prev.speakSeconds + e.seconds;
      else if (e.type === "join-room") next.roomsJoined = prev.roomsJoined + 1;
      else if (e.type === "topic-completed") next.topicsCompleted = prev.topicsCompleted + 1;

      // Detect newly unlocked badges
      const newlyUnlocked = BADGES.filter((b) => !prevUnlocked.current.has(b.id) && b.unlocked(next));
      newlyUnlocked.forEach((b) => prevUnlocked.current.add(b.id));

      const id = ++counter.current;
      const reason: Record<XPEvent["type"], string> = {
        message: "Message sent",
        "voice-message": "Voice sent",
        speak: "Speaking",
        "join-room": "Joined room",
        "topic-completed": "Topic completed",
      };
      const events: AwardEvent[] = [{ id, delta, reason: reason[e.type] }];
      newlyUnlocked.forEach((b) => events.push({ id: ++counter.current, delta: 0, reason: "Badge unlocked", badge: b }));
      setRecent((r) => [...events, ...r].slice(0, 6));
      return next;
    });
  }, []);

  // Auto-clear toasts
  useEffect(() => {
    if (recent.length === 0) return;
    const t = setTimeout(() => setRecent((r) => r.slice(0, -1)), 3500);
    return () => clearTimeout(t);
  }, [recent]);

  const value = useMemo<Ctx>(() => ({
    stats,
    level: computeLevel(stats.totalXp),
    badges: BADGES.map((b) => ({ badge: b, unlocked: b.unlocked(stats) })),
    recent,
    award,
    reset: () => { setStats(EMPTY_STATS); prevUnlocked.current = new Set(); },
  }), [stats, recent, award]);

  return <GamificationCtx.Provider value={value}>{children}</GamificationCtx.Provider>;
};

export const useGamification = (): Ctx => {
  const ctx = useContext(GamificationCtx);
  if (!ctx) throw new Error("useGamification must be inside <GamificationProvider>");
  return ctx;
};