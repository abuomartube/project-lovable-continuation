import { useCallback, useMemo, useState } from "react";
import { TOPIC_CATEGORIES, TOPICS, getTopics, pickRandom, type Topic, type TopicCategory } from "@/lib/topics";

export type CategoryFilter = TopicCategory | "All";

export const useTopicDeck = (initial: CategoryFilter = "All") => {
  const [category, setCategory] = useState<CategoryFilter>(initial);
  const pool = useMemo(() => getTopics(category), [category]);
  const [current, setCurrent] = useState<Topic>(() => pool[0] ?? TOPICS[0]);
  const [history, setHistory] = useState<Topic[]>([]);

  const next = useCallback(() => {
    const choice = pickRandom(pool, current);
    setHistory((h) => [current, ...h].slice(0, 20));
    setCurrent(choice);
  }, [pool, current]);

  const surprise = useCallback(() => {
    const choice = pickRandom(TOPICS, current);
    setHistory((h) => [current, ...h].slice(0, 20));
    setCurrent(choice);
    setCategory(choice.category);
  }, [current]);

  const changeCategory = useCallback((c: CategoryFilter) => {
    setCategory(c);
    const newPool = getTopics(c);
    if (!newPool.find((t) => t.id === current.id)) {
      setCurrent(newPool[0] ?? current);
    }
  }, [current]);

  return {
    category,
    categories: ["All", ...TOPIC_CATEGORIES] as CategoryFilter[],
    current,
    history,
    next,
    surprise,
    setCategory: changeCategory,
  };
};