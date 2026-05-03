export const SUGGESTED_PROMPTS = [
  "Introduce yourself",
  "Talk about your weekend",
  "Describe your goal in English",
  "Share a fun fact about you",
  "What did you learn this week?",
];

export const ICE_BREAKERS = [
  "If you could have dinner with anyone, who would it be?",
  "What's your favorite way to relax?",
  "Coffee or tea — and why?",
  "What's one thing on your bucket list?",
  "What song are you into right now?",
];

export const QUESTIONS = [
  "Can you give an example?",
  "Why do you think so?",
  "How did that make you feel?",
  "What would you do differently?",
  "Could you say that another way?",
];

import { TOPICS } from "./topics";
export const pickDailyTopic = () => {
  // Deterministic per day so everyone in the room sees the same one.
  const day = Math.floor(Date.now() / 86_400_000);
  return TOPICS[day % TOPICS.length];
};
