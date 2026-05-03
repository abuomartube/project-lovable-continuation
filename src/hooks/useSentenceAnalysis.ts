import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Mistake {
  wrong: string;
  right: string;
  type: string;
}
export interface SentenceAnalysis {
  corrected: string;
  mistakes: Mistake[];
  hint: string;
  improved: string;
}

export const useSentenceAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(async (text: string): Promise<SentenceAnalysis | null> => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-sentence", {
        body: { text },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data as SentenceAnalysis;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to analyze";
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { analyze, loading, error };
};