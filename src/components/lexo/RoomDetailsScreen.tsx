import { ChevronLeft, MoreHorizontal, Mic, Check, Headphones, Users } from "lucide-react";
import { IconButton } from "./IconButton";
import { Avatar } from "./Avatar";

const rules = [
  "تحدث فقط باللغة الإنجليزية",
  "احترم الآخرين واستمع جيداً",
  "لا تقاطع أثناء حديث الآخرين",
  "مشاركة مفيدة وإيجابية",
];

const participants = ["Omar", "Sara", "Lina", "James", "Noah", "Aya", "Liam", "Mia"];

export const RoomDetailsScreen = () => {
  return (
    <div dir="rtl" className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-glass-border/40 bg-card/60 px-4 pb-3 pt-10 backdrop-blur-xl">
        <IconButton variant="ghost" size="sm">
          <ChevronLeft className="h-5 w-5 rotate-180" />
        </IconButton>
        <h2 className="text-sm font-semibold">تفاصيل الغرفة</h2>
        <IconButton variant="ghost" size="sm">
          <MoreHorizontal className="h-5 w-5" />
        </IconButton>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto px-3 py-4">
        {/* Hero card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-primary p-5 shadow-glow">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-12 -left-8 h-40 w-40 rounded-full bg-primary-glow/40 blur-3xl" />

          <div className="relative flex items-start gap-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 shadow-mic backdrop-blur">
              <Mic className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-bold text-white">Speaking Room – Intermediate</h3>
              <p className="mt-1 text-xs text-white/80">تطوير الطلاقة وزيادة الثقة</p>
            </div>
          </div>

          {/* Sound wave */}
          <div className="relative mt-4 flex h-10 items-center gap-0.5">
            {Array.from({ length: 56 }).map((_, i) => (
              <span
                key={i}
                className="w-0.5 rounded-full bg-white/70"
                style={{ height: `${4 + Math.abs(Math.sin(i * 0.55)) * 28}px` }}
              />
            ))}
          </div>

          <div className="relative mt-4 flex items-center justify-between text-xs text-white/90">
            <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              24 Online
            </span>
            <span className="rounded-full bg-white/15 px-2.5 py-1 font-medium backdrop-blur">
              متوسط المستوى · B1+ → C1
            </span>
          </div>
        </div>

        {/* About */}
        <section className="glass rounded-2xl p-4">
          <h4 className="mb-2 text-sm font-semibold">عن الغرفة</h4>
          <p className="text-xs leading-relaxed text-muted-foreground">
            غرفة المحادثة الإنجليزية لمستوى المتوسط فما فوق. تحدث عن مواضيع مختلفة ونساعد بعضنا على التطور.
          </p>
        </section>

        {/* Rules */}
        <section className="glass rounded-2xl p-4">
          <h4 className="mb-3 text-sm font-semibold">قواعد الغرفة</h4>
          <ul className="space-y-2.5">
            {rules.map((r) => (
              <li key={r} className="flex items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-success/15 text-success shadow-[0_0_12px_hsl(var(--success)/0.4)]">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs text-foreground/90">{r}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Participants */}
        <section className="glass rounded-2xl p-4">
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-sm font-semibold">المشاركون الآن</h4>
            <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
              <Users className="h-3 w-3" /> 24
            </span>
          </div>
          <div className="flex items-center">
            <div className="flex -space-x-2">
              {participants.map((n) => (
                <Avatar key={n} name={n} size="sm" />
              ))}
            </div>
            <span className="mr-2 rounded-full border border-glass-border/40 bg-secondary/60 px-2 py-1 text-[10px] font-medium text-muted-foreground">
              +19
            </span>
          </div>
        </section>

        {/* Actions */}
        <div className="space-y-2.5 pt-1">
          <button className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-gradient-primary text-sm font-semibold text-primary-foreground shadow-glow transition-all hover:scale-[1.01] hover:shadow-[0_0_55px_hsl(var(--primary)/0.55)] active:scale-[0.99]">
            <Headphones className="h-4 w-4" />
            انضمام إلى الغرفة
          </button>
          <button className="flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/5 text-sm font-medium text-foreground transition-all hover:bg-primary/10">
            استمع أولاً
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailsScreen;