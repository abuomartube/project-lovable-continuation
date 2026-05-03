import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "lexo:daily-challenge:v2";

interface State {
  /** Day index (local-tz days since epoch) of the most recent completion. */
  lastCompletedDay: number | null;
  /** Current consecutive-day streak. */
  streak: number;
  /** Longest streak ever achieved. */
  bestStreak: number;
}

const EMPTY: State = { lastCompletedDay: null, streak: 0, bestStreak: 0 };

export function getDayIndex(d = new Date()): number {
  return Math.floor((d.getTime() - d.getTimezoneOffset() * 60_000) / 86_400_000);
}

export function msUntilNextDay(): number {
  const now = new Date();
  const next = new Date(now);
  next.setHours(24, 0, 0, 0);
  return next.getTime() - now.getTime();
}

function load(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {}
  return EMPTY;
}

function save(s: State) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); } catch {}
}

export const useDailyChallenge = () => {
  const [state, setState] = useState<State>(load);
  const today = getDayIndex();

  // Reset streak if the user missed a day (last completion is older than yesterday)
  useEffect(() => {
    if (state.lastCompletedDay == null) return;
    if (state.lastCompletedDay < today - 1 && state.streak !== 0) {
      const next: State = { ...state, streak: 0 };
      setState(next);
      save(next);
    }
  }, [state, today]);

  const completed = state.lastCompletedDay === today;

  const complete = useCallback(() => {
    setState((prev) => {
      if (prev.lastCompletedDay === today) return prev; // already done
      // continuation if yesterday, otherwise restart at 1
      const continuing = prev.lastCompletedDay === today - 1;
      const streak = continuing ? prev.streak + 1 : 1;
      const next: State = {
        lastCompletedDay: today,
        streak,
        bestStreak: Math.max(prev.bestStreak, streak),
      };
      save(next);
      return next;
    });
  }, [today]);

  const reset = useCallback(() => {
    setState(EMPTY);
    save(EMPTY);
  }, []);

  return {
    completed,
    streak: state.streak,
    bestStreak: state.bestStreak,
    lastCompletedDay: state.lastCompletedDay,
    complete,
    reset,
  };
};