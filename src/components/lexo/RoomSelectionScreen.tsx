import { useState } from "react";
import { ChevronLeft, Search, MessageCircle, Mic, GraduationCap, Users, Sparkles } from "lucide-react";
import { IconButton } from "./IconButton";

const filters = ["الكل", "محادثة", "صوت فقط", "IELTS", "عام"];

type Room = {
  id: string;
  title: string;
  level?: string;
  online: number;
  cta: "join" | "soon";
  icon: typeof MessageCircle;
  iconTint: string; // tailwind bg color for glowing icon bg
  glow: string; // tailwind shadow color
};

const rooms: Room[] = [
  {
    id: "beginner",
    title: "غرفة المحادثة - المبتدئين",
    level: "A1 → A2",
    online: 18,
    cta: "join",
    icon: MessageCircle,
    iconTint: "from-purple-500 to-indigo-600",
    glow: "shadow-[0_0_25px_hsl(258_90%_60%/0.45)]",
  },
  {
    id: "intermediate",
    title: "غرفة المحادثة - المتوسط",
    level: "B1+ → C1",
    online: 24,
    cta: "join",
    icon: MessageCircle,
    iconTint: "from-blue-500 to-cyan-500",
    glow: "shadow-[0_0_25px_hsl(200_90%_55%/0.45)]",
  },
  {
    id: "voice",
    title: "غرفة الصوت فقط",
    online: 12,
    cta: "soon",
    icon: Mic,
    iconTint: "from-pink-500 to-rose-500",
    glow: "shadow-[0_0_25px_hsl(340_85%_60%/0.45)]",
  },
  {
    id: "ielts",
    title: "غرفة محادثة الآيلتس",
    level: "B1 → C2",
    online: 16,
    cta: "join",
    icon: GraduationCap,
    iconTint: "from-amber-500 to-orange-500",
    glow: "shadow-[0_0_25px_hsl(30_90%_55%/0.45)]",
  },
  {
    id: "general",
    title: "الدردشة العامة",
    online: 20,
    cta: "join",
    icon: Users,
    iconTint: "from-emerald-500 to-teal-500",
    glow: "shadow-[0_0_25px_hsl(160_75%_50%/0.45)]",
  },
];

interface RoomSelectionScreenProps {
  recommendedIds?: string[];
}

export const RoomSelectionScreen = ({ recommendedIds = [] }: RoomSelectionScreenProps) => {
  const [active, setActive] = useState("الكل");
  const recSet = new Set(recommendedIds);
  const sorted = recommendedIds.length
    ? [...rooms].sort((a, b) => Number(recSet.has(b.id)) - Number(recSet.has(a.id)))
    : rooms;

  return (
    <div dir="rtl" className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-glass-border/40 bg-card/60 px-4 pb-4 pt-10 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <IconButton variant="ghost" size="sm">
            <ChevronLeft className="h-5 w-5 rotate-180" />
          </IconButton>
          <h2 className="text-base font-semibold">اختيار الغرفة</h2>
          <span className="h-8 w-8" />
        </div>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          اختر الغرفة المناسبة لمستواك وهدفك
        </p>

        {/* Search */}
        <div className="mt-4 flex h-11 items-center gap-2 rounded-full border border-glass-border/40 bg-secondary/50 px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder="ابحث عن غرفة..."
            className="flex-1 bg-transparent text-right text-sm placeholder:text-muted-foreground focus:outline-none"
          />
        </div>

        {/* Filter chips */}
        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
          {filters.map((f) => {
            const isActive = f === active;
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={
                  "shrink-0 rounded-full px-3.5 py-1.5 text-xs transition-all " +
                  (isActive
                    ? "bg-gradient-primary text-primary-foreground shadow-glow"
                    : "border border-glass-border/40 bg-secondary/40 text-muted-foreground hover:bg-secondary/70")
                }
              >
                {f}
              </button>
            );
          })}
        </div>
      </div>

      {/* Room list */}
      <div className="flex-1 space-y-3 overflow-y-auto px-3 py-4">
        {sorted.map((r) => {
          const Icon = r.icon;
          const disabled = r.cta === "soon";
          const recommended = recSet.has(r.id);
          return (
            <div
              key={r.title}
              className={
                "glass glass-hover relative flex items-center gap-3 rounded-[20px] p-3 " +
                (recommended ? "!border-primary/50 shadow-glow" : "")
              }
            >
              {recommended && (
                <span className="absolute -top-2 right-4 flex items-center gap-1 rounded-full bg-gradient-primary px-2 py-0.5 text-[9px] font-bold text-white shadow-glow">
                  <Sparkles className="h-2.5 w-2.5" /> موصى به لك
                </span>
              )}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${r.iconTint} ${r.glow}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold">{r.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  {r.level && (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 font-medium text-primary-glow">
                      {r.level}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-success" />
                    {r.online} متصل
                  </span>
                </div>
              </div>
              <button
                disabled={disabled}
                className={
                  "shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all " +
                  (disabled
                    ? "cursor-not-allowed border border-glass-border/40 bg-secondary/40 text-muted-foreground"
                    : "bg-gradient-primary text-primary-foreground shadow-glow hover:scale-[1.04]")
                }
              >
                {disabled ? "قريباً" : "الانضمام"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoomSelectionScreen;