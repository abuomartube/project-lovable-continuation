import { useCallback, useSyncExternalStore } from "react";

export type Role = "student" | "teacher";
const KEY = "lexo:role:v1";

const load = (): Role => {
  try {
    const raw = localStorage.getItem(KEY);
    return raw === "teacher" ? "teacher" : "student";
  } catch { return "student"; }
};

let state: Role = load();
const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => { listeners.delete(cb); }; };

export const setRole = (r: Role) => {
  state = r;
  try { localStorage.setItem(KEY, r); } catch { /* noop */ }
  listeners.forEach((l) => l());
};

export const useRole = () => {
  const role = useSyncExternalStore(subscribe, () => state, () => state);
  return {
    role,
    isTeacher: role === "teacher",
    setRole: useCallback(setRole, []),
    toggle: useCallback(() => setRole(state === "teacher" ? "student" : "teacher"), []),
  };
};
