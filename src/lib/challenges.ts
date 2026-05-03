export const DAILY_CHALLENGES = [
  "Use the past tense in your next 3 messages.",
  "Describe your morning routine in 5 sentences.",
  "Use one new vocabulary word you learned this week.",
  "Tell us about a goal you have for this month.",
  "Ask 2 open-ended questions to other students.",
  "Share a small story using 'because' and 'although'.",
  "Compare two cities you'd like to visit.",
  "Use a phrasal verb (like 'give up', 'look forward to') in a sentence.",
];

export const pickRandomChallenge = () =>
  DAILY_CHALLENGES[Math.floor(Math.random() * DAILY_CHALLENGES.length)];