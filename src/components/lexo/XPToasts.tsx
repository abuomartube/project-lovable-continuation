import { useGamification } from "@/hooks/useGamification";
import { Sparkles } from "lucide-react";

export const XPToasts = () => {
  const { recent } = useGamification();
  return (
    <div className="pointer-events-none fixed right-6 top-6 z-50 flex flex-col gap-2">
      {recent.map((e) => {
        if (e.badge) {
          const Icon = e.badge.icon;
          return (
            <div key={e.id} className="glass animate-fade-in flex items-center gap-3 rounded-2xl px-4 py-2.5 shadow-glow">
              <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br text-white ${e.badge.tint}`}>
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-primary-glow">Badge unlocked</p>
                <p className="text-xs font-semibold">{e.badge.name}</p>
              </div>
            </div>
          );
        }
        return (
          <div key={e.id} className="glass animate-fade-in flex items-center gap-2 rounded-full px-3 py-1.5 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
            <span className="font-semibold text-primary-glow">+{e.delta} XP</span>
            <span className="text-muted-foreground">{e.reason}</span>
          </div>
        );
      })}
    </div>
  );
};

export default XPToasts;