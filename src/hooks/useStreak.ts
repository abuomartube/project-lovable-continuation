import { useEffect, useState, useCallback, useSyncExternalStore } from "react";

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

let state: StreakState = load();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const setState = (next: StreakState) => {
  state = next;
  try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* noop */ }
  emit();
};

export const pingStreak = () => {
  const today = todayKey();
  if (state.lastDay === today) return;
  let current = 1;
  if (state.lastDay) {
    const gap = daysBetween(state.lastDay, today);
    if (gap === 1) current = state.current + 1;
    else if (gap === 0) current = state.current || 1;
    else current = 1;
  }
  setState({ current, longest: Math.max(state.longest, current), lastDay: today });
};

export const resetStreak = () => setState(EMPTY);

const subscribe = (cb: () => void) => {
  listeners.add(cb);
  return () => { listeners.delete(cb); };
};

export const useStreak = () => {
  const snap = useSyncExternalStore(subscribe, () => state, () => state);
  const today = todayKey();
  const activeToday = snap.lastDay === today;
  const atRisk = snap.lastDay
    ? daysBetween(snap.lastDay, today) === 1 && !activeToday
    : false;
  const ping = useCallback(pingStreak, []);
  return { ...snap, activeToday, atRisk, ping };
};

// Auto-ping each day on mount via a small hook
export const useDailyStreakPing = () => {
  useEffect(() => { pingStreak(); }, []);
};
