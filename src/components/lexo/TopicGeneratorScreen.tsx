import { ChevronLeft, Sparkles, ArrowRight, History } from "lucide-react";
import { IconButton } from "./IconButton";
import { useTopicDeck } from "@/hooks/useTopicDeck";

export const TopicGeneratorScreen = () => {
  const { category, categories, current, history, next, surprise, setCategory } = useTopicDeck("All");
  const Icon = current.icon;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm">
          <ChevronLeft className="h-5 w-5" />
        </IconButton>
        <h2 className="text-sm font-semibold">Topic Generator</h2>
        <span className="h-8 w-8" />
      </div>

      {/* Category tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-glass-border/30 bg-card/40 px-3 py-2.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={
              "shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-all " +
              (c === category
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "border border-glass-border/40 bg-secondary/40 text-muted-foreground hover:text-foreground")
            }
          >
            {c}
          </button>
        ))}
      </div>

      {/* One topic at a time */}
      <div key={current.id} className="flex flex-1 flex-col items-center justify-center gap-4 px-4 py-6 animate-fade-in">
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-glow">
          {current.category} · Topic
        </span>

        <div className="glass relative w-full overflow-hidden rounded-3xl p-5">
          <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br opacity-30 blur-2xl ${current.tint}`} />
          <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-glow ${current.tint}`}>
            <Icon className="h-5 w-5" />
          </div>
          <p className="text-base font-semibold leading-relaxed text-foreground">{current.text}</p>

          {current.followUps && current.followUps.length > 0 && (
            <div className="mt-4 space-y-1.5 border-t border-glass-border/40 pt-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Follow-ups</p>
              {current.followUps.map((q) => (
                <p key={q} className="text-xs text-muted-foreground">• {q}</p>
              ))}
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="flex w-full items-center gap-2 text-[10px] text-muted-foreground">
            <History className="h-3 w-3" />
            <span className="truncate">Last: {history[0].text}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="border-t border-glass-border/40 bg-card/60 px-3 py-3 backdrop-blur-xl">
        <div className="flex gap-2">
          <button
            onClick={next}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-glass-border/40 bg-secondary/50 text-sm font-semibold text-foreground transition-all hover:bg-secondary active:scale-[0.98]"
          >
            Next topic <ArrowRight className="h-4 w-4" />
          </button>
          <button
            onClick={surprise}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:brightness-110 active:scale-[0.96]"
          >
            <Sparkles className="h-4 w-4" /> Surprise me
          </button>
        </div>
      </div>
    </div>
  );
};

export default TopicGeneratorScreen;