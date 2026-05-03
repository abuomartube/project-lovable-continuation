import { MapPin, Target, Users, Film, Briefcase, GraduationCap, Coffee, Plane, BookOpen, Lightbulb, Heart, Globe } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type TopicCategory = "Daily" | "IELTS" | "Travel" | "Work";

export interface Topic {
  id: string;
  text: string;
  category: TopicCategory;
  icon: LucideIcon;
  tint: string; // tailwind gradient stops
  followUps?: string[];
}

export const TOPIC_CATEGORIES: TopicCategory[] = ["Daily", "IELTS", "Travel", "Work"];

export const TOPICS: Topic[] = [
  // Daily
  { id: "d1", text: "Describe your perfect morning routine.", category: "Daily", icon: Coffee, tint: "from-amber-500 to-orange-500",
    followUps: ["What time do you usually wake up?", "Do you exercise in the morning?"] },
  { id: "d2", text: "What is something small that made you happy this week?", category: "Daily", icon: Heart, tint: "from-pink-500 to-rose-500",
    followUps: ["Why did it matter to you?"] },
  { id: "d3", text: "Talk about a hobby you'd love to start.", category: "Daily", icon: Lightbulb, tint: "from-yellow-500 to-amber-500",
    followUps: ["What is stopping you from starting it?"] },
  { id: "d4", text: "Describe your favorite meal and why you love it.", category: "Daily", icon: Users, tint: "from-emerald-500 to-teal-500" },

  // IELTS
  { id: "i1", text: "Some people think technology makes us less social. Do you agree?", category: "IELTS", icon: Globe, tint: "from-indigo-500 to-blue-500",
    followUps: ["Give an example from your own life.", "How could this be improved?"] },
  { id: "i2", text: "Describe a book that influenced you. You should say what it was, when you read it, and why it changed you.", category: "IELTS", icon: BookOpen, tint: "from-violet-500 to-purple-500" },
  { id: "i3", text: "Is it better for children to grow up in cities or in the countryside?", category: "IELTS", icon: GraduationCap, tint: "from-cyan-500 to-blue-500",
    followUps: ["What are the advantages of each?"] },
  { id: "i4", text: "Describe a memorable journey. Where did you go, who with, and why was it memorable?", category: "IELTS", icon: Target, tint: "from-emerald-500 to-green-500" },

  // Travel
  { id: "t1", text: "Describe a place you visited that surprised you.", category: "Travel", icon: MapPin, tint: "from-blue-500 to-cyan-500",
    followUps: ["What did you expect vs what you found?"] },
  { id: "t2", text: "Would you rather travel alone or with friends? Why?", category: "Travel", icon: Plane, tint: "from-sky-500 to-indigo-500" },
  { id: "t3", text: "Talk about a food you tried abroad for the first time.", category: "Travel", icon: Film, tint: "from-rose-500 to-red-500" },
  { id: "t4", text: "Which country would you live in for a year and why?", category: "Travel", icon: Globe, tint: "from-teal-500 to-cyan-500" },

  // Work
  { id: "w1", text: "Do you prefer working in a team or alone?", category: "Work", icon: Users, tint: "from-amber-500 to-orange-500",
    followUps: ["When does each work best?"] },
  { id: "w2", text: "Describe a skill you learned from a job.", category: "Work", icon: Briefcase, tint: "from-purple-500 to-fuchsia-500" },
  { id: "w3", text: "Is remote work better than working in an office?", category: "Work", icon: Lightbulb, tint: "from-emerald-500 to-teal-500",
    followUps: ["What do you lose by going remote?"] },
  { id: "w4", text: "Talk about a goal you want to achieve in your career.", category: "Work", icon: Target, tint: "from-indigo-500 to-violet-500" },
];

export const getTopics = (category: TopicCategory | "All") =>
  category === "All" ? TOPICS : TOPICS.filter((t) => t.category === category);

export const pickRandom = <T,>(items: T[], avoid?: T): T => {
  if (items.length === 0) throw new Error("No topics");
  if (items.length === 1) return items[0];
  let next = items[Math.floor(Math.random() * items.length)];
  let guard = 0;
  while (avoid && next === avoid && guard++ < 10) {
    next = items[Math.floor(Math.random() * items.length)];
  }
  return next;
};