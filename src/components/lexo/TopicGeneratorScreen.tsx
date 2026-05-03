import { useState } from "react";
import { ChevronLeft, Sparkles, MapPin, Target, Users, Film } from "lucide-react";
import { IconButton } from "./IconButton";

const cats = ["All", "Travel", "Daily Life", "Study", "Work"];
const topics = [
  { t: "Describe a place you visited recently", Icon: MapPin, tint: "from-blue-500 to-cyan-500" },
  { t: "What are your goals for the next year?", Icon: Target, tint: "from-emerald-500 to-teal-500" },
  { t: "Do you prefer working in a team or alone?", Icon: Users, tint: "from-amber-500 to-orange-500" },
  { t: "Talk about your favorite movie", Icon: Film, tint: "from-pink-500 to-rose-500" },
];

export const TopicGeneratorScreen = () => {
  const [active, setActive] = useState("All");
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm">
          <ChevronLeft className="h-5 w-5" />
        </IconButton>
        <h2 className="text-sm font-semibold">Topic Generator</h2>
        <span className="h-8 w-8" />
      </div>
      <div className="flex items-center gap-2 overflow-x-auto border-b border-glass-border/30 bg-card/40 px-3 py-2.5">
        {cats.map((c) => (
          <button
            key={c}
            onClick={() => setActive(c)}
            className={
              "shrink-0 rounded-full px-3 py-1 text-xs transition-all " +
              (c === active
                ? "bg-gradient-primary text-primary-foreground shadow-glow"
                : "border border-glass-border/40 bg-secondary/40 text-muted-foreground")
            }
          >
            {c}
          </button>
        ))}
      </div>
      <div className="flex-1 space-y-2.5 overflow-y-auto px-3 py-4">
        {topics.map(({ t, Icon, tint }) => (
          <div key={t} className="glass flex items-center gap-3 rounded-2xl p-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-glow ${tint}`}>
              <Icon className="h-4 w-4" />
            </div>
            <p className="text-xs font-medium text-foreground">{t}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-glass-border/40 bg-card/60 px-3 py-3 backdrop-blur-xl">
        <button className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow hover:scale-[1.01]">
          <Sparkles className="h-4 w-4" /> Surprise me
        </button>
      </div>
    </div>
  );
};

export default TopicGeneratorScreen;