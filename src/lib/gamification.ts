import { MessageCircle, Mic, DoorOpen, Award, Flame, Star, Trophy, Crown, type LucideIcon } from "lucide-react";

export type XPEvent =
  | { type: "message"; chars?: number }
  | { type: "speak"; seconds: number }
  | { type: "join-room" }
  | { type: "topic-completed" };

export const XP_RULES = {
  message: 5,           // per message
  messageBonus: 0.05,   // per char
  speakPerSecond: 1,    // 60xp / minute
  joinRoom: 25,
  topicCompleted: 40,
} as const;

export const xpForEvent = (e: XPEvent): number => {
  switch (e.type) {
    case "message": return XP_RULES.message + Math.min(20, Math.floor((e.chars ?? 0) * XP_RULES.messageBonus));
    case "speak": return Math.round(e.seconds * XP_RULES.speakPerSecond);
    case "join-room": return XP_RULES.joinRoom;
    case "topic-completed": return XP_RULES.topicCompleted;
  }
};

/** Smooth XP curve: each level needs 100 + level*40 xp. */
export const xpForLevel = (level: number): number => 100 + level * 40;

export interface LevelInfo {
  level: number;
  intoLevel: number;   // xp earned inside current level
  needed: number;      // xp needed for next level
  progress: number;    // 0..1
}

export const computeLevel = (totalXp: number): LevelInfo => {
  let level = 1;
  let remaining = totalXp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  const needed = xpForLevel(level);
  return { level, intoLevel: remaining, needed, progress: needed === 0 ? 0 : remaining / needed };
};

export interface Stats {
  totalXp: number;
  messages: number;
  speakSeconds: number;
  roomsJoined: number;
  topicsCompleted: number;
}

export const EMPTY_STATS: Stats = {
  totalXp: 0,
  messages: 0,
  speakSeconds: 0,
  roomsJoined: 0,
  topicsCompleted: 0,
};

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  tint: string;
  unlocked: (s: Stats) => boolean;
}

export const BADGES: Badge[] = [
  { id: "first-message", name: "First Word", description: "Send your first message", icon: MessageCircle,
    tint: "from-cyan-500 to-blue-500", unlocked: (s) => s.messages >= 1 },
  { id: "chatty",        name: "Chatty",     description: "Send 50 messages",        icon: MessageCircle,
    tint: "from-blue-500 to-indigo-500", unlocked: (s) => s.messages >= 50 },
  { id: "first-mic",     name: "On Air",     description: "Speak for the first time", icon: Mic,
    tint: "from-pink-500 to-rose-500", unlocked: (s) => s.speakSeconds >= 5 },
  { id: "ten-minutes",   name: "10-Minute Talker", description: "Speak for 10 minutes total", icon: Mic,
    tint: "from-fuchsia-500 to-purple-500", unlocked: (s) => s.speakSeconds >= 600 },
  { id: "explorer",      name: "Explorer",   description: "Join 5 rooms",            icon: DoorOpen,
    tint: "from-emerald-500 to-teal-500", unlocked: (s) => s.roomsJoined >= 5 },
  { id: "topic-master",  name: "Topic Master", description: "Complete 10 topics",    icon: Star,
    tint: "from-amber-500 to-orange-500", unlocked: (s) => s.topicsCompleted >= 10 },
  { id: "streak-flame",  name: "On Fire",    description: "Reach Level 5",           icon: Flame,
    tint: "from-orange-500 to-red-500", unlocked: (s) => computeLevel(s.totalXp).level >= 5 },
  { id: "champion",      name: "Champion",   description: "Reach Level 10",          icon: Trophy,
    tint: "from-yellow-500 to-amber-500", unlocked: (s) => computeLevel(s.totalXp).level >= 10 },
  { id: "legend",        name: "Legend",     description: "Reach Level 20",          icon: Crown,
    tint: "from-violet-500 to-fuchsia-500", unlocked: (s) => computeLevel(s.totalXp).level >= 20 },
];

export const ALL_BADGE_ICON = Award;