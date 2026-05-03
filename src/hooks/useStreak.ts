import { useEffect, useState, useCallback } from "react";

const KEY = "lexo:streak:v1";

export interface StreakState {
  current: number;
  longest: number;
  lastDay: string | null; // YYYY-MM-DD
}

const EMPTY: StreakState = { current: 0, longest: 0, lastDay: null };

const todayKey = (d = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const daysBetween = (a: string, b: string) => {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db.getTime() - da.getTime()) / 86_400_000);
};

const load = (): StreakState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch { /* noop */ }
  return EMPTY;
};

const compute = (prev: StreakState, today: string): StreakState => {
  if (prev.lastDay === today) return prev;
  let current = 1;
  if (prev.lastDay) {
    const gap = daysBetween(prev.lastDay, today);
    if (gap === 1) current = prev.current + 1;
    else if (gap === 0) current = prev.current || 1;
    else current = 1;
  }
  const longest = Math.max(prev.longest, current);
  return { current, longest, lastDay: today };
};

export const useStreak = () => {
  const [state, setState] = useState<StreakState>(load);

  const ping = useCallback(() => {
    setState((prev) => {
      const next = compute(prev, todayKey());
      if (next === prev) return prev;
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
      return next;
    });
  }, []);

  useEffect(() => { ping(); }, [ping]);

  // Status helpers
  const today = todayKey();
  const activeToday = state.lastDay === today;
  const atRisk = state.lastDay
    ? daysBetween(state.lastDay, today) === 1 && !activeToday
    : false;

  return { ...state, activeToday, atRisk, ping };
};
