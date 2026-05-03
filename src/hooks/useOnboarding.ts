import { useCallback, useSyncExternalStore } from "react";

export type EnglishLevel = "A1" | "A2" | "B1" | "B2" | "C1";
export type LearningGoal = "ielts" | "fluency" | "travel" | "work" | "casual";

export interface OnboardingProfile {
  name: string;
  level: EnglishLevel;
  goal: LearningGoal;
  minutesPerDay: number;
  completedAt: number;
}

const KEY = "lexo:onboarding:v1";

const load = (): OnboardingProfile | null => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as OnboardingProfile) : null;
  } catch { return null; }
};

let state: OnboardingProfile | null = load();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export const completeOnboarding = (p: Omit<OnboardingProfile, "completedAt">) => {
  state = { ...p, completedAt: Date.now() };
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* noop */ }
  emit();
};

export const resetOnboarding = () => {
  state = null;
  try { localStorage.removeItem(KEY); } catch { /* noop */ }
  emit();
};

export const useOnboarding = () => {
  const snap = useSyncExternalStore(subscribe, () => state, () => state);
  return {
    profile: snap,
    completed: !!snap,
    complete: useCallback(completeOnboarding, []),
    reset: useCallback(resetOnboarding, []),
  };
};

// Map (level, goal) -> recommended room ids
export const recommendedRoomIds = (level: EnglishLevel, goal: LearningGoal): string[] => {
  if (goal === "ielts") return ["ielts", "intermediate", "voice"];
  if (level === "A1" || level === "A2") return ["beginner", "general", "voice"];
  if (goal === "travel") return ["general", "intermediate", "voice"];
  if (goal === "work") return ["intermediate", "ielts", "voice"];
  if (goal === "fluency") return ["voice", "intermediate", "general"];
  return ["intermediate", "general", "voice"];
};
