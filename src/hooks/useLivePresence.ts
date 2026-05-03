import { useEffect, useRef, useState } from "react";

const NAMES = ["Sara", "Omar", "Lina", "James", "Aisha", "Yusuf", "Maya", "Karim", "Noor", "Hassan", "Layla"];

export interface PresenceEvent {
  id: number;
  type: "join" | "leave";
  name: string;
}

export interface LivePresence {
  online: number;
  typing: string[];
  events: PresenceEvent[];
}

/**
 * Simulated presence — driven entirely client-side until WebRTC/Realtime is wired.
 * Same shape will be returned by a future server-backed implementation.
 */
export const useLivePresence = (initialOnline = 18): LivePresence => {
  const [online, setOnline] = useState(initialOnline);
  const [typing, setTyping] = useState<string[]>([]);
  const [events, setEvents] = useState<PresenceEvent[]>([]);
  const counter = useRef(0);

  useEffect(() => {
    const presenceTimer = window.setInterval(() => {
      const join = Math.random() > 0.45;
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      setOnline((n) => Math.max(5, Math.min(99, n + (join ? 1 : -1))));
      const id = ++counter.current;
      setEvents((prev) => [{ id, type: join ? "join" : "leave", name }, ...prev].slice(0, 4));
    }, 5200);

    const typingTimer = window.setInterval(() => {
      // 1-2 random typers, rotates often
      const count = Math.random() > 0.5 ? 1 : 2;
      const picks = [...NAMES].sort(() => Math.random() - 0.5).slice(0, count);
      setTyping(Math.random() > 0.3 ? picks : []);
    }, 2400);

    return () => {
      window.clearInterval(presenceTimer);
      window.clearInterval(typingTimer);
    };
  }, []);

  // Auto-expire toasts
  useEffect(() => {
    if (events.length === 0) return;
    const t = window.setTimeout(() => setEvents((e) => e.slice(0, -1)), 3500);
    return () => window.clearTimeout(t);
  }, [events]);

  return { online, typing, events };
};